/**
 * Example client code for using the authentication API
 * This shows how to integrate with the auth endpoints from a frontend application
 */

interface AuthResponse {
  user: {
    id: string;
    email: string;
    createdAt: string;
  };
  session: {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
    expiresAt: number;
  };
  message: string;
}

interface RefreshResponse {
  session: {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
    expiresAt: number;
  };
  message: string;
}

interface UserResponse {
  user: {
    id: string;
    email: string;
    createdAt: string;
    emailConfirmed: boolean;
  };
}

class AuthClient {
  private baseUrl: string;
  private accessToken: string | null = null;
  private refreshToken: string | null = null;

  constructor(baseUrl: string = 'http://localhost:3000') {
    this.baseUrl = baseUrl;
    // Load tokens from storage if available
    this.loadTokens();
  }

  /**
   * Sign up a new user
   */
  async signup(email: string, password: string): Promise<AuthResponse> {
    const response = await fetch(`${this.baseUrl}/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Signup failed');
    }

    const data: AuthResponse = await response.json();

    // Store tokens
    if (data.session) {
      this.setTokens(data.session.accessToken, data.session.refreshToken);
    }

    return data;
  }

  /**
   * Log in an existing user
   */
  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await fetch(`${this.baseUrl}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Login failed');
    }

    const data: AuthResponse = await response.json();

    // Store tokens
    this.setTokens(data.session.accessToken, data.session.refreshToken);

    return data;
  }

  /**
   * Refresh the access token
   */
  async refresh(): Promise<RefreshResponse> {
    if (!this.refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await fetch(`${this.baseUrl}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken: this.refreshToken }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Token refresh failed');
    }

    const data: RefreshResponse = await response.json();

    // Update tokens
    this.setTokens(data.session.accessToken, data.session.refreshToken);

    return data;
  }

  /**
   * Get current user information
   */
  async getCurrentUser(): Promise<UserResponse> {
    if (!this.accessToken) {
      throw new Error('Not authenticated');
    }

    const response = await fetch(`${this.baseUrl}/auth/me`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
      },
    });

    if (!response.ok) {
      // Try to refresh token if expired
      if (response.status === 401 && this.refreshToken) {
        await this.refresh();
        // Retry with new token
        return this.getCurrentUser();
      }

      const error = await response.json();
      throw new Error(error.error?.message || 'Failed to get user');
    }

    return response.json();
  }

  /**
   * Log out the current user
   */
  async logout(): Promise<void> {
    if (!this.accessToken) {
      throw new Error('Not authenticated');
    }

    const response = await fetch(`${this.baseUrl}/auth/logout`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Logout failed');
    }

    // Clear tokens
    this.clearTokens();
  }

  /**
   * Make an authenticated API request
   * Automatically handles token refresh if needed
   */
  async authenticatedRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    if (!this.accessToken) {
      throw new Error('Not authenticated');
    }

    // Add authorization header
    const headers = {
      ...options.headers,
      'Authorization': `Bearer ${this.accessToken}`,
      'Content-Type': 'application/json',
    };

    let response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers,
    });

    // If unauthorized and we have a refresh token, try refreshing
    if (response.status === 401 && this.refreshToken) {
      try {
        await this.refresh();

        // Retry the request with new token
        response = await fetch(`${this.baseUrl}${endpoint}`, {
          ...options,
          headers: {
            ...options.headers,
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json',
          },
        });
      } catch (error) {
        // Refresh failed, clear tokens
        this.clearTokens();
        throw new Error('Session expired. Please log in again.');
      }
    }

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Request failed');
    }

    return response.json();
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return this.accessToken !== null;
  }

  /**
   * Store tokens (implement based on your storage mechanism)
   */
  private setTokens(accessToken: string, refreshToken: string): void {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;

    // Store in localStorage (browser)
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
    }
  }

  /**
   * Load tokens from storage
   */
  private loadTokens(): void {
    if (typeof localStorage !== 'undefined') {
      this.accessToken = localStorage.getItem('accessToken');
      this.refreshToken = localStorage.getItem('refreshToken');
    }
  }

  /**
   * Clear tokens from storage
   */
  private clearTokens(): void {
    this.accessToken = null;
    this.refreshToken = null;

    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    }
  }
}

// Example usage:

async function exampleUsage() {
  const authClient = new AuthClient('http://localhost:3000');

  try {
    // Sign up
    console.log('Signing up...');
    const signupResult = await authClient.signup('user@example.com', 'password123');
    console.log('Signed up:', signupResult.user);

    // Get current user
    console.log('Getting current user...');
    const user = await authClient.getCurrentUser();
    console.log('Current user:', user);

    // Make authenticated request to chat endpoint
    console.log('Sending chat message...');
    const chatResponse = await authClient.authenticatedRequest('/chat/messages', {
      method: 'POST',
      body: JSON.stringify({
        conversationId: 'some-conversation-id',
        message: 'What is compound interest?',
      }),
    });
    console.log('Chat response:', chatResponse);

    // Log out
    console.log('Logging out...');
    await authClient.logout();
    console.log('Logged out successfully');

  } catch (error) {
    console.error('Error:', error);
  }
}

// For React/Vue/Angular applications, you might want to create a context/provider:

// React example:
/*
import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext<AuthClient | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authClient] = useState(() => new AuthClient());

  return (
    <AuthContext.Provider value={authClient}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

// Usage in component:
function LoginForm() {
  const auth = useAuth();

  const handleLogin = async (email: string, password: string) => {
    try {
      await auth.login(email, password);
      // Redirect to dashboard or show success message
    } catch (error) {
      // Show error message
    }
  };

  // ... rest of component
}
*/

export { AuthClient };

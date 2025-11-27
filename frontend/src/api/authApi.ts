import { publicApiClient, apiClient } from '../lib/apiClient';
import type { User, AuthResponse } from '../types';

interface LoginCredentials {
  email: string;
  password: string;
}

interface SignupCredentials {
  email: string;
  password: string;
}

export async function login(credentials: LoginCredentials): Promise<AuthResponse> {
  const response = await publicApiClient.post<AuthResponse>('/auth/login', credentials);
  return response.data;
}

export async function signup(credentials: SignupCredentials): Promise<AuthResponse> {
  const response = await publicApiClient.post<AuthResponse>('/auth/signup', credentials);
  return response.data;
}

export async function logout(): Promise<void> {
  await apiClient.post('/auth/logout');
}

export async function getCurrentUser(): Promise<User> {
  const response = await apiClient.get<{ user: User }>('/auth/me');
  return response.data.user;
}

export async function refreshToken(refreshToken: string): Promise<AuthResponse['session']> {
  const response = await publicApiClient.post<{ session: AuthResponse['session'] }>(
    '/auth/refresh',
    { refreshToken }
  );
  return response.data.session;
}

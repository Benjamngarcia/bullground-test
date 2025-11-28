// API client configuration matching the web app's apiClient
import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Config } from '../constants/config-bullground';

const TOKEN_KEY = '@bullground_auth_token';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: Config.API_BASE_URL,
      timeout: Config.API_TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to add auth token
    this.client.interceptors.request.use(
      async (config: InternalAxiosRequestConfig) => {
        try {
          const token = await AsyncStorage.getItem(TOKEN_KEY);
          if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
            console.log('[API Client] Token attached to request:', token.substring(0, 20) + '...');
          } else {
            console.log('[API Client] No token found in storage');
          }
        } catch (error) {
          console.error('[API Client] Error getting token:', error);
        }
        return config;
      },
      (error) => {
        console.error('[API Client] Request interceptor error:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => {
        console.log('[API Client] Response:', response.config.method?.toUpperCase(), response.config.url, response.status);
        return response;
      },
      async (error: AxiosError) => {
        console.error('[API Client] Response error:', error.response?.status, error.message);
        if (error.response?.status === 401) {
          // Token expired or invalid - clear token
          console.log('[API Client] Clearing token due to 401');
          await this.clearToken();
        }
        return Promise.reject(error);
      }
    );
  }

  async setToken(token: string): Promise<void> {
    try {
      await AsyncStorage.setItem(TOKEN_KEY, token);
      console.log('[API Client] Token stored successfully');
    } catch (error) {
      console.error('[API Client] Error storing token:', error);
      throw error;
    }
  }

  async getToken(): Promise<string | null> {
    try {
      const token = await AsyncStorage.getItem(TOKEN_KEY);
      return token;
    } catch (error) {
      console.error('[API Client] Error retrieving token:', error);
      return null;
    }
  }

  async clearToken(): Promise<void> {
    try {
      await AsyncStorage.removeItem(TOKEN_KEY);
      console.log('[API Client] Token cleared successfully');
    } catch (error) {
      console.error('[API Client] Error clearing token:', error);
    }
  }

  get axios() {
    return this.client;
  }
}

export const apiClient = new ApiClient();

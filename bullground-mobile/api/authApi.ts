import { apiClient } from './client';
import { AuthResponse, User } from '../types';

export async function login(email: string, password: string): Promise<AuthResponse> {
  const response = await apiClient.axios.post<AuthResponse>('/auth/login', {
    email,
    password,
  });

  if (response.data.session?.accessToken) {
    await apiClient.setToken(response.data.session.accessToken);
  } else {
    console.error('[Auth API] No access token in response!');
  }

  return response.data;
}

export async function signup(email: string, password: string): Promise<AuthResponse> {
  const response = await apiClient.axios.post<AuthResponse>('/auth/signup', {
    email,
    password,
  });

  if (response.data.session?.accessToken) {
    await apiClient.setToken(response.data.session.accessToken);
  } else {
    console.error('[Auth API] No access token in signup response!');
  }

  return response.data;
}


export async function logout(): Promise<void> {
  await apiClient.clearToken();
}


export async function getCurrentUser(): Promise<User> {
  const response = await apiClient.axios.get<{ user: User }>('/auth/me');
  return response.data.user;
}


export async function isAuthenticated(): Promise<boolean> {
  const token = await apiClient.getToken();
  return !!token;
}

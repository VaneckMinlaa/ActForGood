import {API_BASE_URL} from '../Constants/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DEFAULT_TIMEOUT = 10000;

async function request<T>(
  method: string,
  url: string,
  options?: {body?: any; headers?: Record<string, string>}
): Promise<T> {
  const token = await AsyncStorage.getItem('token');
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT);

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...options?.headers,
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  let body: string | undefined;
  if (options?.body != null && method !== 'GET') {
    body = typeof options.body === 'string' ? options.body : JSON.stringify(options.body);
  }

  try {
    const response = await fetch(`${API_BASE_URL}${url}`, {
      method,
      headers,
      body,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (response.status === 401) {
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('user');
    }

    const text = await response.text();
    let data: T | undefined;
    if (text && text.trim()) {
      try {
        data = JSON.parse(text) as T;
      } catch {
        data = undefined;
      }
    }

    if (!response.ok) {
      const error: any = new Error(response.statusText || 'Request failed');
      error.response = {status: response.status, data};
      throw error;
    }

    return (data ?? undefined) as T;
  } catch (err: any) {
    clearTimeout(timeoutId);
    if (err.name === 'AbortError') {
      const timeoutError: any = new Error('Request timeout');
      timeoutError.response = {status: 0};
      throw timeoutError;
    }
    throw err;
  }
}

class ApiService {
  async get<T>(url: string): Promise<T> {
    return request<T>('GET', url);
  }

  async post<T>(url: string, data?: any): Promise<T> {
    return request<T>('POST', url, {body: data});
  }

  async put<T>(url: string, data?: any): Promise<T> {
    return request<T>('PUT', url, {body: data});
  }

  async delete<T>(url: string): Promise<T> {
    return request<T>('DELETE', url);
  }
}

export default new ApiService();

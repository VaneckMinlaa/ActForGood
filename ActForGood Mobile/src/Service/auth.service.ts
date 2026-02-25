import AsyncStorage from '@react-native-async-storage/async-storage';
import {API_ENDPOINTS} from '../Constants/api';
import {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
} from '../Models/auth.model';
import apiService from './api.service';

class AuthService {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await apiService.post<AuthResponse>(
      API_ENDPOINTS.AUTH.LOGIN,
      credentials,
    );
    await this.storeAuthData(response);
    return response;
  }

  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await apiService.post<AuthResponse>(
      API_ENDPOINTS.AUTH.REGISTER,
      data,
    );
    await this.storeAuthData(response);
    return response;
  }

  async logout(): Promise<void> {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('user');
  }

  async getToken(): Promise<string | null> {
    return await AsyncStorage.getItem('token');
  }

  async getUser(): Promise<AuthResponse | null> {
    const userStr = await AsyncStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  async isAuthenticated(): Promise<boolean> {
    const token = await this.getToken();
    return !!token;
  }

  private async storeAuthData(authData: AuthResponse): Promise<void> {
    if (!authData.token) return;
    await AsyncStorage.setItem('token', authData.token);
    await AsyncStorage.setItem('user', JSON.stringify(authData));
  }
}

export default new AuthService();

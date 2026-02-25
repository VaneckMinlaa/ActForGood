import {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
} from '../Models/auth.model';
import authService from '../Service/auth.service';

class AuthRepository {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    return await authService.login(credentials);
  }

  async register(data: RegisterRequest): Promise<AuthResponse> {
    return await authService.register(data);
  }

  async logout(): Promise<void> {
    return await authService.logout();
  }

  async getToken(): Promise<string | null> {
    return await authService.getToken();
  }

  async getUser(): Promise<AuthResponse | null> {
    return await authService.getUser();
  }

  async isAuthenticated(): Promise<boolean> {
    return await authService.isAuthenticated();
  }
}

export default new AuthRepository();

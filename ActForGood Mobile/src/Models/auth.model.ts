export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password?: string;
  firstName: string;
  lastName: string;
  phone?: string;
  userType: string;
  location?: string;
  country?: string;
}

export interface AuthResponse {
  token: string | null;
  userId: string;
  email: string;
  userType: string;
  expiresIn: number;
}

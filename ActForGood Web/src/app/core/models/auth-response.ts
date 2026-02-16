export interface AuthResponse {
  token: string;
  userId: string;
  email: string;
  userType: string;
  expiresIn: number;
}

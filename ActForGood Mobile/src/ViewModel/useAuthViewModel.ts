import {create} from 'zustand';
import {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
} from '../Models/auth.model';
import authRepository from '../Repository/auth.repository';

interface AuthState {
  user: AuthResponse | null;
  token: string | null;
  isGuest: boolean;
  loading: boolean;
  error: string | null;
  registrationPendingMessage: string | null;

  login: (credentials: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: AuthResponse) => void;
  clearError: () => void;
  clearRegistrationPendingMessage: () => void;
  setGuest: () => void;
}

export const useAuthViewModel = create<AuthState>(set => ({
  user: null,
  token: null,
  isGuest: false,
  loading: false,
  error: null,
  registrationPendingMessage: null,

  login: async (credentials: LoginRequest) => {
    set({loading: true, error: null});
    try {
      const response = await authRepository.login(credentials);
      set({loading: false, user: response, token: response.token});
    } catch (err: any) {
      set({loading: false, error: err.message || 'Login failed'});
    }
  },

  register: async (data: RegisterRequest) => {
    set({loading: true, error: null});
    try {
      const response = await authRepository.register(data);
      if (response.token) {
        set({
          loading: false,
          user: response,
          token: response.token,
          registrationPendingMessage: null,
        });
      } else {
        set({
          loading: false,
          user: null,
          token: null,
          error: null,
          registrationPendingMessage:
            "Votre compte a été créé. Vous recevrez votre mot de passe par email après validation par l'administrateur.",
        });
      }
    } catch (err: any) {
      set({loading: false, error: err.message || 'Registration failed'});
    }
  },

  logout: async () => {
    try {
      await authRepository.logout();
    } finally {
      set({user: null, token: null, isGuest: false});
    }
  },

  setUser: (user: AuthResponse) => set({user, token: user.token}),
  clearError: () => set({error: null}),
  clearRegistrationPendingMessage: () =>
    set({registrationPendingMessage: null}),
  setGuest: () => set({isGuest: true}),
}));

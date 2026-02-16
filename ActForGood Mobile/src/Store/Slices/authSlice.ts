import {createSlice, createAsyncThunk, PayloadAction} from '@reduxjs/toolkit';
import authService, {LoginRequest, RegisterRequest, AuthResponse} from '../../Services/auth.service';

interface AuthState {
  user: AuthResponse | null;
  token: string | null;
  isGuest: boolean;
  loading: boolean;
  error: string | null;
  registrationPendingMessage: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isGuest: false,
  loading: false,
  error: null,
  registrationPendingMessage: null,
};

export const login = createAsyncThunk(
  'auth/login',
  async (credentials: LoginRequest) => {
    return await authService.login(credentials);
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async (data: RegisterRequest) => {
    return await authService.register(data);
  }
);

export const logout = createAsyncThunk('auth/logout', async () => {
  await authService.logout();
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<AuthResponse>) => {
      state.user = action.payload;
      state.token = action.payload.token;
    },
    clearError: state => {
      state.error = null;
    },
    clearRegistrationPendingMessage: state => {
      state.registrationPendingMessage = null;
    },
    setGuest: state => {
      state.isGuest = true;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(login.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.token = action.payload.token;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Login failed';
      })
      .addCase(register.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.token) {
          state.user = action.payload;
          state.token = action.payload.token;
          state.registrationPendingMessage = null;
        } else {
          state.user = null;
          state.token = null;
          state.error = null;
          state.registrationPendingMessage =
            'Votre compte a été créé. Vous recevrez votre mot de passe par email après validation par l\'administrateur.';
        }
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Registration failed';
      })
      .addCase(logout.fulfilled, state => {
        state.user = null;
        state.token = null;
        state.isGuest = false;
      });
  },
});

export const {setUser, clearError, setGuest, clearRegistrationPendingMessage} = authSlice.actions;
export default authSlice.reducer;

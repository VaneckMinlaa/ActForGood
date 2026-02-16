import {configureStore} from '@reduxjs/toolkit';
import authReducer from './Slices/authSlice';
import campaignReducer from './Slices/campaignSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    campaigns: campaignReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

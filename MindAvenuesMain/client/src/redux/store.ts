//src/redux/store.ts
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import authSlice from '../features/auth/authSlice';
import paymentSlice from '../features/payment/paymentSlice';
import assessmentSlice from '../features/assessment/assessmentSlice';
import adminSlice from '@/features/admin/adminSlice';
import passwordSlice from '@/features/password/passwordSlice';
import imageSlice from '@/features/image/imageSlice';
import profileSlice from '@/features/profile/profileSlice';

const rootReducer = combineReducers({
  auth: authSlice,
  payment: paymentSlice,
  assessment: assessmentSlice,
  admin: adminSlice, // New
  password: passwordSlice, // Add password reducer
  image: imageSlice, // Add image reducer
  profile: profileSlice,
});

const loadState = (): Partial<RootState> | undefined => {
  if (typeof window === 'undefined') return undefined;
  try {
    const serializedState = localStorage.getItem('reduxState');
    return serializedState ? JSON.parse(serializedState) : undefined;
  } catch (err) {
    console.error('Failed to load state:', err);
    return undefined;
  }
};

const saveState = (state: RootState) => {
  if (typeof window === 'undefined') return;
  try {
    const serializedState = JSON.stringify({ auth: state.auth });
    localStorage.setItem('reduxState', serializedState);
  } catch (err) {
    console.error('Failed to save state:', err);
  }
};

export const store = configureStore({
  reducer: rootReducer,
  preloadedState: loadState(),
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }),
});

if (typeof window !== 'undefined') {
  store.subscribe(() => saveState(store.getState()));
}

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;

export default store;
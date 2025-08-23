/* eslint-disable no-undef */
// src/store.js
import { configureStore } from '@reduxjs/toolkit';
import { authApi } from './context/authApi';
import { resumeApi } from './context/resumeApi';
import { writtenTestApi } from './context/writtenTestApi';
import resumeReducer from './context/resumeSlice';

const loggerMiddleware = (store) => (next) => (action) => {
  if (process.env.NODE_ENV === 'development') {
    console.log('Dispatching action:', action);
    console.log('State before:', store.getState());
  }
  const result = next(action);
  if (process.env.NODE_ENV === 'development') {
    console.log('State after:', store.getState());
  }
  return result;
};

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [resumeApi.reducerPath]: resumeApi.reducer,
    [writtenTestApi.reducerPath]: writtenTestApi.reducer,
    resume: resumeReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          'authApi/executeQuery/fulfilled',
          'authApi/executeMutation/fulfilled',
        ],
        ignoredPaths: ['authApi.queries', 'authApi.mutations'],
      },
    }).concat(
      authApi.middleware,
      resumeApi.middleware,
      writtenTestApi.middleware,   // ✅ FIX: Add this line
      loggerMiddleware
    ),
  devTools: process.env.NODE_ENV !== 'production',
});

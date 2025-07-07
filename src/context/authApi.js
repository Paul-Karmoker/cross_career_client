import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';


const BASE_URL = 'https://backend-server-deploy.onrender.com/api/v1/auth/';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Withdrawals'],
  endpoints: (builder) => ({
    signup: builder.mutation({
      query: (credentials) => ({
        url: 'signup',
        method: 'POST',
        body: credentials,
      }),
      transformResponse: (response) => {
        if (response.token) {
          localStorage.setItem('token', response.token);
        }
        return response;
      },
      onError: (error) => {
        console.error('Signup error:', error);
      },
    }),

    login: builder.mutation({
      query: (credentials) => ({
        url: 'login',
        method: 'POST',
        body: credentials,
      }),
      transformResponse: (response) => {
        
        if (response.token) {
          localStorage.setItem('token', response.token);
        }
        return response;
      },
      onError: (error) => {
        console.error('Login error:', error);
      },
    }),

    
     // OAuth Endpoints
    getGoogleAuthUrl: builder.query({
      query: () => 'google',
    }),

    getFacebookAuthUrl: builder.query({
      query: () => 'facebook',
    }),

    getLinkedInAuthUrl: builder.query({
      query: () => 'linkedin',
    }),

   
    

    forgotPassword: builder.mutation({
      query: ({ email }) => ({
        url: 'forgot-password',
        method: 'POST',
        body: { email },
      }),
    }),

    resetPassword: builder.mutation({
      query: (data) => ({
        url: 'reset-password',
        method: 'POST',
        body: data,
      }),
    }),

    verifyEmail: builder.query({
      query: (token) => `verify-email?token=${token}`,
    }),

    getprofile: builder.query({
      query: () => 'get-profile',
      providesTags: ['Profile'],
    }),

    updateProfile: builder.mutation({
  query: (profileData) => ({
    url: '/profile', // Ensure this matches your backend endpoint
    method: 'PATCH',
    body: profileData,
    headers: {
      'Content-Type': 'application/json',
      
    },
  }), // Add transform if needed to match backend expectations
  transformResponse: (response) => response.data,
}),

    changePassword: builder.mutation({
      query: (data) => ({
        url: 'change-password',
        method: 'PATCH',
        body: data,
      }),
    }),

    subscribe: builder.mutation({
      query: (data) => ({
        url: 'subcribe',
        method: 'POST',
        body: data,
      }),
    }),

    withdraw: builder.mutation({
      query: (data) => ({
        url: 'withdraw',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Withdrawals'],
    }),

    getWithdrawals: builder.query({
      query: () => 'withdraw',
      providesTags: ['Withdrawals'],
    }),
  }),
});

export const {
  useSignupMutation,
  useLoginMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useVerifyEmailQuery,
  useGetprofileQuery,
  useUpdateProfileMutation,
  useChangePasswordMutation,
  useSubscribeMutation,
  useWithdrawMutation,
  useGetWithdrawalsQuery,
  useGetGoogleAuthUrlQuery,
  useGetFacebookAuthUrlQuery,
  useGetLinkedInAuthUrlQuery
} = authApi;


export function logout() {
  localStorage.removeItem('token');
  // Optional: navigate or reload
  window.location.href = '/login'; // or use navigate('/login') from React Router
}
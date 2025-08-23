// src/features/resume/resumeApi.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const BASE_URL = 'http://api.crosscareers.com/api/v1/resume';

export const resumeApi = createApi({
  reducerPath: 'resumeApi',
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
  tagTypes: ['Resume'],
  endpoints: (builder) => ({
    createResume: builder.mutation({
      query: (data) => ({
        url: '/',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Resume'],
    }),
    getResume: builder.query({
      query: (id) => `/${id}`,
      providesTags: ['Resume'],
    }),
    updateResume: builder.mutation({
      query: ({ id, data }) => ({
        url: `/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Resume'],
    }),
    deleteResume: builder.mutation({
      query: (id) => ({
        url: `/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Resume'],
    }),
    addWorkExperience: builder.mutation({
      query: ({ id, workExp }) => ({
        url: `/${id}/work-experience`,
        method: 'POST',
        body: workExp,
      }),
      invalidatesTags: ['Resume'],
    }),
    deleteWorkExperience: builder.mutation({
      query: ({ id, index }) => ({
        url: `/${id}/work-experience`,
        method: 'DELETE',
        body: { index },
      }),
      invalidatesTags: ['Resume'],
    }),
    addEducation: builder.mutation({
      query: ({ id, education }) => ({
        url: `/${id}/education`,
        method: 'POST',
        body: education,
      }),
      invalidatesTags: ['Resume'],
    }),
    deleteEducation: builder.mutation({
      query: ({ id, index }) => ({
        url: `/${id}/education`,
        method: 'DELETE',
        body: { index },
      }),
      invalidatesTags: ['Resume'],
    }),
    addReference: builder.mutation({
      query: ({ id, reference }) => ({
        url: `/${id}/reference`,
        method: 'POST',
        body: reference,
      }),
      invalidatesTags: ['Resume'],
    }),
    deleteReference: builder.mutation({
      query: ({ id, index }) => ({
        url: `/${id}/reference`,
        method: 'DELETE',
        body: { index },
      }),
      invalidatesTags: ['Resume'],
    }),
    getJobDescriptionSuggestion: builder.mutation({
      query: (workExp) => ({
        url: '/suggest/job-description',
        method: 'POST',
        body: { workExp },
      }),
    }),
    getSkillsSuggestion: builder.mutation({
      query: (workExperiences) => ({
        url: '/suggest/skills',
        method: 'POST',
        body: { workExperiences },
      }),
    }),
    getCareerObjectiveSuggestion: builder.mutation({
      query: (data) => ({
        url: '/suggest/career-objective',
        method: 'POST',
        body: data,
      }),
    }),
    getCareerSummarySuggestion: builder.mutation({
      query: (data) => ({
        url: '/suggest/career-summary',
        method: 'POST',
        body: data,
      }),
    }),
  }),
});

export const {
  useCreateResumeMutation,
  useGetResumeQuery,
  useUpdateResumeMutation,
  useDeleteResumeMutation,
  useAddWorkExperienceMutation,
  useDeleteWorkExperienceMutation,
  useAddEducationMutation,
  useDeleteEducationMutation,
  useAddReferenceMutation,
  useDeleteReferenceMutation,
  useGetJobDescriptionSuggestionMutation,
  useGetSkillsSuggestionMutation,
  useGetCareerObjectiveSuggestionMutation,
  useGetCareerSummarySuggestionMutation,
} = resumeApi;
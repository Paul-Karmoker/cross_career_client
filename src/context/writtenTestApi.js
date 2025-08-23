import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const BASE_URL = "http://api.crosscareers.com/api/v1/writtenTest";

export const writtenTestApi = createApi({
  reducerPath: "writtenTestApi",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["WrittenTest"],
  endpoints: (builder) => ({
    initSession: builder.mutation({
      query: (data) => ({
        url: "/init",
        method: "POST",
        body: data,
      }),
    }),
    startSession: builder.mutation({
      query: (sessionId) => ({
        url: `/start/${sessionId}`,
        method: "POST",
      }),
    }),
    getCurrent: builder.query({
      query: (sessionId) => `/current/${sessionId}`,
    }),
    submitAnswer: builder.mutation({
      query: (data) => ({
        url: "/answer",
        method: "POST",
        body: data,
      }),
    }),
    getResult: builder.query({
      query: (sessionId) => `/result/${sessionId}`,
    }),
    getTimeLeft: builder.query({
      query: (sessionId) => `/time/${sessionId}`,
    }),
    downloadPdf: builder.query({
      query: (sessionId) => `/result/${sessionId}/pdf`,
    }),
  }),
});

export const {
  useInitSessionMutation,
  useStartSessionMutation,
  useGetCurrentQuery,
  useSubmitAnswerMutation,
  useGetResultQuery,
  useGetTimeLeftQuery,
  useLazyDownloadPdfQuery
} = writtenTestApi;

import { fetchBaseQuery, createApi } from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({
  baseUrl: "http://localhost:5000/",
  prepareHeaders: (headers, { getState }) => {
    const { userInfo } = getState().auth;

    if (userInfo && userInfo.token) {
      headers.set("Authorization", `Bearer ${userInfo.token}`);
    }

    return headers;
  },
  credentials: "include", // Enable sending cookies
});

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: baseQuery,
  tagTypes: ["User", "Category", "SubCategory", "Products"],
  endpoints: (builder) => ({}),
  onQueryStarted: (request, { dispatch, getState }) => {
    const { userInfo } = getState().auth;

    if (userInfo && userInfo.token) {
      request.headers["Authorization"] = `Bearer ${userInfo.token}`;
      console.log(userInfo.token);
    } else {
      console.log("No user info or token found");
    }
  },
});

import { apiSlice } from "../apiSlice";
const USER_URL = "/api/users";

export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUser: builder.query({
      query: () => `${USER_URL}/get-users`,
      method: "GET",
    }),
    deleteUser: builder.mutation({
      query: ({ id }) => ({
        url: `${USER_URL}/delete-user/${id}`,
        method: "DELETE",
        body: JSON.stringify({ id }),
      }),
    }),
  }),
});

export const { useGetUserQuery, useDeleteUserMutation } = userApiSlice;

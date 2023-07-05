import { apiSlice } from "../apiSlice";
const CAT_URL = "/api/categories";

export const catApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    addCat: builder.mutation({
      query: (data) => ({
        url: `${CAT_URL}/create-category/`,
        method: "POST",
        body: data,
      }),
    }),
    deleteCat: builder.mutation({
      query: ({ id }) => ({
        url: `${CAT_URL}/delete-category/${id}`,
        method: "DELETE",
        body: JSON.stringify({ id }),
      }),
    }),
    getCat: builder.query({
      query: () => `${CAT_URL}/get-categories`,
      providesTags: (result, error, arg) => {
        if (result) {
          return Array.from(result, ({ id }) => ({
            type: "Category",
            id,
          }));
        } else {
          return ["Category"];
        }
      },
    }),
    updateCat: builder.mutation({
      query: ({ id, catName, image, status }) => ({
        url: `${CAT_URL}/update-category/${id}`,
        method: "PUT",
        body: { catName, image, status }, // Update the body object to include all fields
      }),
    }),

    getOneCat: builder.query({
      query: ({ id }) => `${CAT_URL}/get-category/${id}`,
      providesTags: (result, error, arg) => {
        if (result) {
          return Array.from(result, ({ id }) => ({
            type: "Category",
            id,
          }));
        } else {
          return ["Category"];
        }
      },
    }),
  }),
});
export const {
  useAddCatMutation,
  useGetCatQuery,
  useDeleteCatMutation,
  useGetOneCatQuery,
  useUpdateCatMutation,
} = catApiSlice;

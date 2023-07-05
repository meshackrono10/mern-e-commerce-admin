import { apiSlice } from "../apiSlice";
const SUB_BASE = "/api/sub-categories";

export const subCatApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    addSubCat: builder.mutation({
      query: ({ name, image, status, SUB_CAT_URL }) => ({
        url: `${SUB_BASE}/${SUB_CAT_URL}/subcategories/`,
        method: "POST",
        body: { name, image, status },
      }),
    }),
    deleteSubCat: builder.mutation({
      query: ({ id, SUB_CAT_URL }) => ({
        url: `${SUB_BASE}/${SUB_CAT_URL}/subcategories/${id}`,
        method: "DELETE",
        body: JSON.stringify({ id }),
      }),
    }),

    updateSubCat: builder.mutation({
      query: ({ id, data, SUB_CAT_URL }) => ({
        url: `${SUB_BASE}/${SUB_CAT_URL}/subcategories/${id}`,
        method: "PUT",
        body: data, // Update the body object to include all fields
      }),
    }),
    getAllSubCats: builder.query({
      query: ({ SUB_CAT_URL }) => `${SUB_BASE}/${SUB_CAT_URL}/subcategories/`,
      providesTags: (result, error, arg) => {
        if (result) {
          return Array.from(result, ({ id }) => ({
            type: "SubCategory",
            id,
          }));
        } else {
          return ["SubCategory"];
        }
      },
    }),
    getOneSubCat: builder.query({
      query: ({ id, SUB_CAT_URL }) =>
        `${SUB_BASE}/${SUB_CAT_URL}/subcategories/${id}`,
      providesTags: (result, error, arg) => {
        if (result) {
          return Array.from(result, ({ id }) => ({
            type: "SubCategory",
            id,
          }));
        } else {
          return ["SubCategory"];
        }
      },
    }),
  }),
});

export const {
  useGetAllSubCatsQuery,
  useDeleteSubCatMutation,
  useAddSubCatMutation,
  useGetOneSubCatQuery,
  useUpdateSubCatMutation,
} = subCatApiSlice;

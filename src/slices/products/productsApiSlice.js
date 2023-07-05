import { apiSlice } from "../apiSlice";
const PRODUCT_URL = "/api/products";

export const productApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    addProduct: builder.mutation({
      query: (data) => ({
        url: `${PRODUCT_URL}/create-product`,
        method: "POST",
        body: data,
      }),
    }),
    deleteProduct: builder.mutation({
      query: ({ id }) => ({
        url: `${PRODUCT_URL}/delete-product/${id}`,
        method: "DELETE",
        body: JSON.stringify({ id }),
      }),
    }),

    updateProduct: builder.mutation({
      query: ({ id, data }) => ({
        url: `${PRODUCT_URL}/update-product/${id}`,
        method: "PUT",
        body: data, // Update the body object to include all fields
      }),
    }),
    getProducts: builder.query({
      query: () => `${PRODUCT_URL}/get-products`,
      providesTags: (result, error, arg) => {
        if (result) {
          return Array.from(result, ({ id }) => ({
            type: "Products",
            id,
          }));
        } else {
          return ["Products"];
        }
      },
    }),
    getOneProduct: builder.query({
      query: ({ id }) => `${PRODUCT_URL}/get-product/${id}`,
      providesTags: (result) => {
        if (result) {
          return Array.from(result, ({ id }) => ({
            type: "Products",
            id,
          }));
        } else {
          return ["Products"];
        }
      },
    }),
  }),
});

export const {
  useAddProductMutation,
  useDeleteProductMutation,
  useGetOneProductQuery,
  useGetProductsQuery,
  useUpdateProductMutation,
} = productApiSlice;

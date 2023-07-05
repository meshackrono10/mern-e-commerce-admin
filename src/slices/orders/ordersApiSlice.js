import { apiSlice } from "../apiSlice";

const ORDER_BASE = "/api/orders";

export const orderApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createOrder: builder.mutation({
      query: ({ data }) => ({
        url: `${ORDER_BASE}`,
        method: "POST",
        body: data,
      }),
    }),
    updateOrder: builder.mutation({
      query: ({ id, data }) => ({
        url: `${ORDER_BASE}/${id}`,
        method: "PUT",
        body: data,
      }),
    }),
    deleteOrder: builder.mutation({
      query: ({ id }) => ({
        url: `${ORDER_BASE}/${id}`,
        method: "DELETE",
      }),
    }),
    getUserOrder: builder.query({
      query: ({ userId }) => `${ORDER_BASE}/user/${userId}`,
    }),
    getAllOrders: builder.query({
      query: () => `${ORDER_BASE}`,
    }),
    getIncome: builder.query({
      query: () => `${ORDER_BASE}/income`,
    }),
    getOrder: builder.query({
      query: ({ id }) => `${ORDER_BASE}/find/order/${id}`,
    }),
    stripePayment: builder.mutation({
      query: ({ data }) => ({
        url: `${ORDER_BASE}/stripe/payment`,
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const {
  useCreateOrderMutation,
  useUpdateOrderMutation,
  useDeleteOrderMutation,
  useGetUserOrderQuery,
  useGetAllOrdersQuery,
  useGetIncomeQuery,
  useGetOrderQuery,
  useStripePaymentMutation,
} = orderApiSlice;

import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "../slices/apiSlice";
import authReducer from "../slices/auth/authSlice";
import catReducer from "../slices/category/catSlice";
import subCatReducer from "../slices/subCat/subCatSlice";
import productReducer from "../slices/products/productSlice";

const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authReducer,
    category: catReducer,
    subCats: subCatReducer,
    productCategory: productReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: true,
});

export default store;

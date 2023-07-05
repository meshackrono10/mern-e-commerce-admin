import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  images: [], // Default empty string
  name: "",
  price: "",
  stock: "",
  category: "",
  desc: "",
  subCategory: "",
};
const productSlice = createSlice({
  name: "productCategory",
  initialState,
  reducers: {
    setProductCategory: (state, action) => {
      state.productName = action.payload.productName;
      state.image = action.payload.image;
    },
    removeProductCategory: (state) => {
      state.productName = "";
      state.image = "";
    },
  },
});

export const { setProductCategory, removeProductCategory } =
  productSlice.actions;

export default productSlice.reducer;

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  image: "", // Default empty string
  catName: "",
};
const catSlice = createSlice({
  name: "category",
  initialState,
  reducers: {
    setCategory: (state, action) => {
      state.catName = action.payload.catName;
      state.image = action.payload.image;
    },
    removeCategory: (state) => {
      state.catName = "";
      state.image = "";
    },
  },
});

export const { setCategory, removeCategory } = catSlice.actions;

export default catSlice.reducer;

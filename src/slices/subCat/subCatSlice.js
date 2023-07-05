import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  name: "",
  image: "",
};
const subCatSlice = createSlice({
  name: "subCat",
  initialState,
  reducers: {
    setSubCat: (state, action) => {
      state.image = action.payload.image;
      state.name = action.payload.name;
    },
    removeSubCats: (state) => {
      state.image = "";
      state.name = "";
    },
  },
});

export const { setSubCat, removeSubCats } = subCatSlice.actions;

export default subCatSlice.reducer;

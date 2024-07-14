import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cartlist: [],
  },
  reducers: {
    setCartList: (state, action) => {
      state.cartlist.push(action.payload);
    },
  },
});

export default cartSlice;

import { createSlice } from "@reduxjs/toolkit";

const commonSlice = createSlice({
  name: "common",
  initialState: {
    // Define your initial state here
    loading: false,
    error: null,
    data: null,
    scrollProperty: {
      scrollTop: 0,
      scrollHeight: 0,
      clientHeight: 0,
    },
  },
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setData: (state, action) => {
      state.data = action.payload;
    },

    setScrollProperty: (state, action) => {
      state.scrollProperty = action.payload;
    },
  },
});

export default commonSlice;

import { configureStore } from "@reduxjs/toolkit";
import CvSlice from "./slices/CvSlice";

const store = configureStore({
  reducer: {
    cvs: CvSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // to disable warning about non-serializable values
    }),
});

export default store;

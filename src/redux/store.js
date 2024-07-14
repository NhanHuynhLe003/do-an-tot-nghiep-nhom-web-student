import { configureStore } from "@reduxjs/toolkit";
import CvSlice from "./slices/CvSlice";
import CommonSlice from "./slices/CommonSlice";
import cartSlice from "./slices/CartSlice";

const store = configureStore({
  reducer: {
    cvs: CvSlice.reducer,
    common: CommonSlice.reducer,
    cart: cartSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // to disable warning about non-serializable values
    }),
});

export default store;

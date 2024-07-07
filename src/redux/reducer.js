import { combineReducers } from "redux";
import cvReducer from "./slices/CvSlice";
import commonReducer from "./slices/CommonSlice";
import cartReducer from "./slices/CartSlice";

const rootReducer = combineReducers({
  cvs: cvReducer,
  common: commonReducer,
  cart: cartReducer,
});

export { rootReducer };

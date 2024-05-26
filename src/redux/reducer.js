import { combineReducers } from "redux";
import cvReducer from "./slices/CvSlice";

const rootReducer = combineReducers({
  cvs: cvReducer,
});

export { rootReducer };

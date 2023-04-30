import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./AuthSlice";
import resumeReducer from "./ResumeSlice";
export default configureStore({
  reducer: {
    auth: authReducer,
    resume : resumeReducer,
  },
});


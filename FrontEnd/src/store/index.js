import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./AuthSlice";
import resumeReducer from "./ResumeSlice";
import userReducer from "./UserSlice";
export default configureStore({
  reducer: {
    auth: authReducer,
    resume : resumeReducer,
    user: userReducer,
  },
});


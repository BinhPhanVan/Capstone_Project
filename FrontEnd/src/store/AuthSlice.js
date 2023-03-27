import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import authService from "../api-service/authService";

export const login = createAsyncThunk(
  "users/login/                          ",
  async (user, { rejectWithValue }) => {
    const { email, password } = user;
    try {
      const res = await authService.login(email, password);
      if (res.data) {
        if (res.data.access_token) {
          return res.data;
        } else {
          return rejectWithValue("Invalid Data");
        }
      } else {
        return rejectWithValue("Invalid");
      }
    } catch (error) {
      console.log(error);
    }
  }
);
const initialState = {
  user: null,
  verifyEmail: "",
};
const userSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAccount: (state, action) => {
      state.account = action.payload;
      localStorage.setItem("account", JSON.stringify(action.payload));
    },
    logout: (state) => {
      state.user = null;
      localStorage.setItem("account", null);
    },
  },
  extraReducers(builder) {
    builder.addCase(login.fulfilled, (state, action) => {
      state.account = action.payload;
      localStorage.setItem("account", JSON.stringify(action.payload));
    });
  },
});

export const selectUser = (state) => state.auth.user;
export const { logout} = userSlice.actions;
export default userSlice.reducer;

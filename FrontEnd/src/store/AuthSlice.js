import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import authService from "../api-service/authService";
import { handleEmail } from "../utils/handleEmail";
export const login = createAsyncThunk(
  "users/login/                          ",
  async (user, { rejectWithValue }) => {
    const { email, password } = user;
    try {
      const res = await authService.login(email, password);
      if (res.data) {
        if (res.data.access_token) {
          return res.data;
        } 
        else {
          return rejectWithValue("Login failed! Please try again.");
        }
      } else {
        return rejectWithValue("Invalid");
      }
    } catch (error) {
      console.log(error);
    }
  }
);

export const signup = createAsyncThunk(
  "users/register",
  async (account, { rejectWithValue }) => {
    try {
      const res = await authService.signup(account);
      if (handleEmail(res.data.email)) {
        console.log(handleEmail(res.data.email));
        return res.data;
      } else {
        return rejectWithValue(res.data.email);
      }
    } catch (error) {
        return rejectWithValue("Sign up Fail");
      }
    }
);
let accountString = null;
try {
  accountString = JSON.parse(localStorage.getItem("account"));
} catch {}

const initialState = {
  user: null,
  account: accountString,
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
    builder.addCase(signup.fulfilled, (state, action) => {
      state.verifyEmail = action.payload.email;
    })
  },
});

export const selectUser = (state) => state.auth.user;
export const selectVerifyEmail = (state) => state.auth.verifyEmail;
export const { logout} = userSlice.actions;
export default userSlice.reducer;

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import authService from "../api-service/authService";
import { handleEmail } from "../utils/handleEmail";
import jwtDecode from 'jwt-decode';
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
        else if (res.status === 406){
          return rejectWithValue(res);
        }
        else {
          return rejectWithValue("Login failed! Please try again.");
        }
      } else {
        return rejectWithValue("Login failed! Please try again.");
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
      account.role = 1;
      const res = await authService.signup(account);
      if (handleEmail(res.data.email) && res.status === 200) {
        return res;
      } else {
        return rejectWithValue(res.message);
      }
    } catch (error) {
        return rejectWithValue("Sign up Fail");
      }
    }
);

export const verify_email = createAsyncThunk(
  "users/confirm_email",
  async (account, { rejectWithValue }) => {
    try {
      const { email, otp } = account;
      const res = await authService.verify_email(email, otp);
      if(res.status === 400)
      {
        return rejectWithValue(res);
      }
      else
      {
        return res;
      }
    } catch (error) {
        return rejectWithValue("Verify Fail");
      }
    }
);
const Information = (access_token) => {
  if(access_token)
  {
    const decodedToken = jwtDecode(access_token);
    return decodedToken;
  }
  return null; 
}

let accountString = null;
let user = null;
try {
  accountString = JSON.parse(localStorage.getItem("account"));
  if(accountString !== null)
  {
    user = Information(accountString?.access_token);
  }
} catch {}

const initialState = {
  user: user,
  full_name: "",
  account: accountString,
  verifyEmail: "",
  isLoading: false,
  isAdmin: Information(accountString?.access_token)?.role === 2,
};
const userSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAccount: (state, action) => {
      state.account = action.payload;
      state.user = Information(action.payload?.access_token);
      state.isAdmin = Information(action.payload?.access_token)?.role === 2;
      localStorage.setItem("account", JSON.stringify(action.payload));
    },
    logout: (state) => {
      state.account = null;
      state.user = null;
      state.isAdmin = false;
      localStorage.setItem("account", null);
    },
  },
  extraReducers(builder) {
    builder.addCase(login.fulfilled, (state, action) => {
      state.account = action.payload;
      localStorage.setItem("account", JSON.stringify(action.payload));
      state.user = Information(action.payload?.access_token);
      state.isAdmin = Information(action.payload?.access_token)?.role === 2;
      state.isLoading = false;
    });
    builder.addCase(login.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(login.rejected, (state, action) => {
      if(action.payload.status === 406)
      {
        state.verifyEmail = action.payload.data.email;
      }
      state.account = null;
      state.user = null;
      state.isAdmin = false;
      localStorage.setItem("account", null);
      state.isLoading = false;
    });
    builder.addCase(signup.fulfilled, (state, action) => {
      state.verifyEmail = action.payload.data.email;
      state.isLoading = false;
    });
    builder.addCase(signup.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(signup.rejected, (state, action) => {
      state.isLoading = false;
    });
    builder.addCase(verify_email.fulfilled, (state, action) => {
      state.account = action.payload.data;
      localStorage.setItem("account", JSON.stringify(action.payload.data));
      state.verifyEmail = action.payload.data.email;
      state.user = Information(action.payload.data?.access_token);
      state.isAdmin = Information(action.payload.data?.access_token)?.role === 2;
    });
    builder.addCase(verify_email.rejected, (state, action) => {
      state.account = null;
      state.user = null;
      localStorage.setItem("account", null);
    })

  },
});

export const selectUser = (state) => state.auth.user;
export const selectIsLoading = (state) => state.auth.isLoading;
export const selectAccount = (state) => state.auth.account;
export const selectAccessToken = (state) => state.auth.account.access_token;
export const selectVerifyEmail = (state) => state.auth.verifyEmail;
export const selectIsAdmin = (state) => state.auth.isAdmin;
export const { logout, setAccount} = userSlice.actions;
export default userSlice.reducer;

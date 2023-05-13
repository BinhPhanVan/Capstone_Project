import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import userService from "../api-service/userService";


export const get_information = createAsyncThunk(
  "users/get_information",
  async (_, { rejectWithValue }) => {
    try {
        const res = await userService.get_information();
        return res.data;
    } catch (error) {
      console.log(error);
      return rejectWithValue("Access denied! Please try again.");
    }
  }
);

export const get_active = createAsyncThunk(
  "employee/get_active",
  async (_, { rejectWithValue }) => {
    try {
        const res = await userService.get_active();
        return res;
    } catch (error) {
      console.log(error);
      return rejectWithValue("Access denied! Please try again.");
    }
  }
);

export const find_job = createAsyncThunk(
  "employee/find_job",
  async (_, { rejectWithValue }) => {
    try {
        const res = await userService.find_job();
        return res;
    } catch (error) {
      console.log(error);
      return rejectWithValue("Access denied! Please try again.");
    }
  }
);

const initialState = {
  isLoading: false,
  file: null,
  user_infor: null,
  is_active: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  extraReducers(builder) {
    builder.addCase(get_information.pending, (state, action) => {
      state.isLoading = true;
      
    });
    builder.addCase(get_information.rejected, (state, action) => {
      state.isLoading = false;
      state.user_infor = null;
      state.file = null;
    });
    builder.addCase(get_information.fulfilled, (state, action) => {
      state.isLoading = false;
      state.user_infor = action.payload;
      state.file = action.payload.pdf_file;
    });
    builder.addCase(get_active.pending, (state, action) => {
      state.isLoading = true;
      state.is_active = false;
      
    });
    builder.addCase(get_active.rejected, (state, action) => {
      state.isLoading = false;
      state.is_active = false;
    });
    builder.addCase(get_active.fulfilled, (state, action) => {
      state.isLoading = false;
      state.is_active = action.payload.data
    });
    builder.addCase(find_job.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(find_job.rejected, (state, action) => {
      state.isLoading = false;

    });
    builder.addCase(find_job.fulfilled, (state, action) => {
      state.isLoading = false;
    });
  },
});
export const selectIsLoading = (state) => state.user.isLoading;
export const selectIsActive = (state) => state.user.is_active;
export const selectUserInfo = (state) => state.user.user_infor;
export const selectFile = (state) => state.user.file;
export default userSlice.reducer;

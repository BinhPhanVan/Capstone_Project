import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import resumeService from "../api-service/resumeService";

export const upload_resume = createAsyncThunk(
  "users/upload_resume",
  async (pdf_file, { rejectWithValue }) => {
    try {
      const res = await resumeService.upload_resume(pdf_file);
        return res;
    } catch (error) {
      console.log(error);
      return rejectWithValue("Upload failed! Please try again.");
    }
  }
);

export const deactive_resume = createAsyncThunk(
  "employee/deactive",
  async (_, { rejectWithValue }) => {
    try {
        const res = await resumeService.deactive_resume();
        return res;
    } catch (error) {
      console.log(error);
      return rejectWithValue("Access denied! Please try again.");
    }
  }
);

const initialState = {
  isLoading: false,
  file: ""
};

const resumeSlice = createSlice({
  name: "resume",
  initialState,
  extraReducers(builder) {
    builder.addCase(upload_resume.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(upload_resume.rejected, (state, action) => {
      state.isLoading = false;
    });
    builder.addCase(upload_resume.fulfilled, (state, action) => {
      state.isLoading = false;
    });
    builder.addCase(deactive_resume.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(deactive_resume.rejected, (state, action) => {
      state.isLoading = false;
    });
    builder.addCase(deactive_resume.fulfilled, (state, action) => {
      state.isLoading = false;
    });
  },
});
export const selectIsLoading = (state) => state.resume.isLoading;
export default resumeSlice.reducer;

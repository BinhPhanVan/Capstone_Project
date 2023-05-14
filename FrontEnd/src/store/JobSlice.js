import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import jobService from "../api-service/jobService";


export const upload_job = createAsyncThunk(
  "users/upload_job",
  async (data, { rejectWithValue }) => {
    try {
      const res = await jobService.upload_job(data);
        return res;
    } catch (error) {
      console.log(error);
      return rejectWithValue("Upload failed! Please try again.");
    }
  }
);

const initialState = {
  isLoading: false,
};

const jobSlice = createSlice({
  name: "job",
  initialState,
  extraReducers(builder) {
    builder.addCase(upload_job.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(upload_job.rejected, (state, action) => {
      state.isLoading = false;
    });
    builder.addCase(upload_job.fulfilled, (state, action) => {
      state.isLoading = false;
    });
  },
});
export const selectIsLoading = (state) => state.job.isLoading;
export default jobSlice.reducer;

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

export const get_all_jobs = createAsyncThunk(
  "employee/get_all_candidate",
  async (_, { rejectWithValue }) => {
    try {
        const res = await jobService.get_all_jobs();
        return res;
    } catch (error) {
      console.log(error);
      return rejectWithValue("Access denied! Please try again.");
    }
  }
);

const initialState = {
  isLoading: false,
  jobs : [],
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
    builder.addCase(get_all_jobs.pending, (state, action) => {
      state.isLoading = true;
      state.jobs = [];
    });
    builder.addCase(get_all_jobs.rejected, (state, action) => {
      state.isLoading = false;
      state.jobs = [];
    });
    builder.addCase(get_all_jobs.fulfilled, (state, action) => {
      state.isLoading = false;
      state.jobs = action.payload;
    });
  },
});
export const selectIsLoading = (state) => state.job.isLoading;
export const selectJobs = (state) => state.job.jobs;
export default jobSlice.reducer;

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
  "employee/get_all_job",
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

export const get_all_jobs_owner = createAsyncThunk(
  "recruiter/get_all_job_owner",
  async (_, { rejectWithValue }) => {
    try {
        const res = await jobService.get_all_jobs_owner();
        return res.data;
    } catch (error) {
      console.log(error);
      return rejectWithValue("Access denied! Please try again.");
    }
  }
);

export const update_job_status = createAsyncThunk(
  "recruiter/update-job",
  async (data, { rejectWithValue }) => {
    try {
        const res = await jobService.update_job_status(data);
        return res;
    } catch (error) {
      console.log(error);
      return rejectWithValue("Access denied! Please try again.");
    }
  }
);
let idJobDeleted;
export const delete_job = createAsyncThunk(
  "recruiter/delete-job",
  async (data, { rejectWithValue }) => {
    try {
        const res = await jobService.delete_job(data);
        idJobDeleted = data;
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
  jobs_owner: [],
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
    builder.addCase(get_all_jobs_owner.pending, (state, action) => {
      state.isLoading = true;
      state.jobs_owner = [];
    });
    builder.addCase(get_all_jobs_owner.rejected, (state, action) => {
      state.isLoading = false;
      state.jobs_owner = [];
    });
    builder.addCase(get_all_jobs_owner.fulfilled, (state, action) => {
      state.isLoading = false;
      state.jobs_owner = action.payload;
    });
    builder.addCase(update_job_status.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(update_job_status.rejected, (state, action) => {
      state.isLoading = false;
    });
    builder.addCase(update_job_status.fulfilled, (state, action) => {
      state.isLoading = false;
      const id = action.payload.data;
      const jobIndex = state.jobs_owner.findIndex(job => job.id === id);
      if (jobIndex !== -1) {
        state.jobs_owner[jobIndex]['active'] = !state.jobs_owner[jobIndex]['active'];
      }
    });
    builder.addCase(delete_job.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(delete_job.rejected, (state, action) => {
      state.isLoading = false;
    });
    builder.addCase(delete_job.fulfilled, (state, action) => {
      state.isLoading = false;
      const id = idJobDeleted;
      const jobIndex = state.jobs_owner.findIndex(job => job.id === id);
      if (jobIndex !== -1) {
        state.jobs_owner.splice(jobIndex, 1);
      }
    });
  },
});
export const selectIsLoading = (state) => state.job.isLoading;
export const selectJobs = (state) => state.job.jobs;
export const selectJobsOwner = (state) => state.job.jobs_owner;
export default jobSlice.reducer;

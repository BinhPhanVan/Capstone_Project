import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import interviewService from "../api-service/interviewService";


export const interview_setup = createAsyncThunk(
    "interview/set-up",
    async (data, { rejectWithValue }) => {
      try {
          const res = await interviewService.setup_interview(data);
          return res;
      } catch (error) {
        return error.response.data;
      }
    }
);

export const get_interview = createAsyncThunk(
    "interview/get-interview",
    async (data, { rejectWithValue }) => {
      try {
          const res = await interviewService.get_interview(data);
          return res;
      } catch (error) {
        return rejectWithValue("No interviews found.");
      }
    }
);

export const update_interview_status = createAsyncThunk(
  "interview/update-status",
  async (data, { rejectWithValue }) => {
    try {
        const res = await interviewService.update_interview_status(data);
        return res;
    } catch (error) {
      return rejectWithValue("Update failed: " + error.message);
    }
  }
);

export const get_interview_by_email = createAsyncThunk(
  "interview/get-interview-by-email",
  async (data, { rejectWithValue }) => {
    try {
        const res = await interviewService.get_interview_by_email(data);
        return res;
    } catch (error) {
      return rejectWithValue("No interviews found.");
    }
  }
);


const initialState = {
  isLoading: false,
  events : [],
  events_by_email : [],
};

const interviewSlice = createSlice({
  name: "interview",
  initialState,
  extraReducers(builder) {
    builder.addCase(interview_setup.pending, (state, action) => {
        state.isLoading = true;
      });
      builder.addCase(interview_setup.rejected, (state, action) => {
        state.isLoading = false;
      });
      builder.addCase(interview_setup.fulfilled, (state, action) => {
        state.isLoading = false;
      });
      builder.addCase(get_interview.pending, (state, action) => {
        state.isLoading = true;
        state.events = [];
      });
      builder.addCase(get_interview.rejected, (state, action) => {
        state.isLoading = false;
        state.events = [];
      });
      builder.addCase(get_interview.fulfilled, (state, action) => {
        state.isLoading = false;
        state.events = action.payload.data;
      });
      builder.addCase(update_interview_status.pending, (state, action) => {
        state.isLoading = true;
      });
      builder.addCase(update_interview_status.rejected, (state, action) => {
        state.isLoading = false;
      });
      builder.addCase(update_interview_status.fulfilled, (state, action) => {
        state.isLoading = false;
      });
      builder.addCase(get_interview_by_email.pending, (state, action) => {
        state.isLoading = true;
        state.events_by_email = [];
      });
      builder.addCase(get_interview_by_email.rejected, (state, action) => {
        state.isLoading = false;
        state.events_by_email = [];
      });
      builder.addCase(get_interview_by_email.fulfilled, (state, action) => {
        state.isLoading = false;
        state.events_by_email = action.payload.data;
      });
  },
});
export const selectIsLoading = (state) => state.interview.isLoading;
export const selectIsInterview = (state) => state.interview.events;
export const selectIsInterviewByEmail = (state) => state.interview.events_by_email;
export default interviewSlice.reducer;

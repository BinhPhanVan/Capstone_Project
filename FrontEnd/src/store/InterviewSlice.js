import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import interviewService from "../api-service/interviewService";


export const interview_setup = createAsyncThunk(
    "interview/set-up",
    async (data, { rejectWithValue }) => {
      try {
          const res = await interviewService.setup_interview(data);
          return res;
      } catch (error) {
        console.log(error);
        return rejectWithValue("Interview already exists today");
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


const initialState = {
  isLoading: false,
  events : [],
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
  },
});
export const selectIsLoading = (state) => state.interview.isLoading;
export const selectIsInterview = (state) => state.interview.events;
export default interviewSlice.reducer;

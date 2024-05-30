import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import auth from "../../utils/auth";

const initialState = {
  loading: false,
  topics: [],
  currentTopics: {},
  isRandom: true,
  allTopics: [],
  questionList: [],
};

export const getTopics = createAsyncThunk(
  "get/topics",
  async (payload, { dispatch, getState, rejectWithValue }) => {
    try {
      const res = await auth.get("/get-topics-list");
      const data = await res.data;
      return data.result;
    } catch (error) {
      // console.log(error);
    }
  }
);

const topicSlice = createSlice({
  name: "topicSlice",
  initialState,
  reducers: {
    setCurrentTopic: (state, { payload }) => {
      state.currentTopics = payload;
    },
    setIsRandom: (state, { payload }) => {
      state.isRandom = payload;
    },
    setAllTopics: (state, { payload }) => {
      state.allTopics = payload;
    },
    setQuestionList: (state, { payload }) => {
      state.questionList = payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getTopics.pending, (state, { payload }) => {
        state.loading = true;
      })
      .addCase(getTopics.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.topics = payload;
      })
      .addCase(getTopics.rejected, (state, { payload }) => {
        state.loading = false;
        state.topics = {};
      });
  },
});

const topicsReducer = topicSlice.reducer;
export const { setCurrentTopic, setIsRandom, setAllTopics } =
  topicSlice.actions;
export default topicsReducer;

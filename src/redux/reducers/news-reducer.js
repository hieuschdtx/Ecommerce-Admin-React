import { createSlice } from '@reduxjs/toolkit';

import { newsActionThunk } from '../actions/news-action';

const { getAllNews } = newsActionThunk;

const newSlice = createSlice({
  name: 'NEWS',
  initialState: {
    news: [],
    loading: false,
    message: null,
    success: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllNews.pending, (state) => ({
        ...state,
        loading: true,
        message: null,
        success: false,
      }))
      .addCase(getAllNews.fulfilled, (state, action) => ({
        ...state,
        loading: false,
        success: true,
        news: action.payload,
      }))
      .addCase(getAllNews.rejected, (state, action) => ({
        ...state,
        loading: false,
        success: false,
        message: action.error?.message,
      }));
  },
});

export default newSlice.reducer;

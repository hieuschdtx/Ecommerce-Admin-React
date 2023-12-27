import { createSlice } from '@reduxjs/toolkit';

import { newsActionThunk } from '../actions/news-action';

const { getAllNews, getDetailNews } = newsActionThunk;
const apiState = { loading: false, result: null, success: false, message: null };

const newSlice = createSlice({
  name: 'NEWS',
  initialState: {
    news: [],
    loading: false,
    message: null,
    success: false,
    getDetail: { ...apiState },
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
      }))
      .addCase(getDetailNews.pending, (state) => ({
        ...state,
        getDetail: { ...apiState, loading: true, success: false, message: null },
      }))
      .addCase(getDetailNews.fulfilled, (state, action) => ({
        ...state,
        getDetail: { ...apiState, loading: false, result: action.payload, success: true },
      }))
      .addCase(getDetailNews.rejected, (state, action) => ({
        ...state,
        getDetail: { ...apiState, loading: false, message: action.error?.message, success: false },
      }));
  },
});

export default newSlice.reducer;

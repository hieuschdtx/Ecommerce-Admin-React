import { createAsyncThunk } from '@reduxjs/toolkit';
import { newsService } from 'src/apis/news-service';

const getAllNews = createAsyncThunk('NEWS_GET_ALL_NEWS', async () => {
  const { data } = await newsService.getAllNews();
  return data;
});

const getDetailNews = createAsyncThunk('NEWS_GET_DETAILS_NEWS', async (p) => {
  const { data } = await newsService.getDetails(p);
  return data;
});

export const newsActionThunk = {
  getAllNews,
  getDetailNews,
};

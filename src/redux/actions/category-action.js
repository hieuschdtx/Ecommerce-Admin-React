import { createAsyncThunk } from '@reduxjs/toolkit';
import { CategoryService } from 'src/apis/category-service';

const getCategories = createAsyncThunk('CATEGORIES_GET_CATEGORIES', async () => {
  const data = await CategoryService.GetAllCategories();
  return data;
});

export const categoryActionThunk = {
  getCategories,
};

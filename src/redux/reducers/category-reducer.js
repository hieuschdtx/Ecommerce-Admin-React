import { createSlice } from '@reduxjs/toolkit';
import { categoryActionThunk } from '../actions/category-action';

const { getCategories } = categoryActionThunk;

const categorySilce = createSlice({
  name: 'AUTHENTICATION',
  initialState: {
    categories: [],
    loading: false,
    message: '',
    success: false,
    error: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    // CreateCategory
    builder
      // GetAllCategories
      .addCase(getCategories.pending, (state) => {
        state.loading = true;
      })
      .addCase(getCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
      });
  },
});

export default categorySilce.reducer;

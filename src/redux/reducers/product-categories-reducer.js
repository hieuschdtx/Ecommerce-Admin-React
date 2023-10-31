import { createSlice } from '@reduxjs/toolkit';
import { productCategoriesActionThunk } from '../actions/product-categories-action';

const { getproductCategories } = productCategoriesActionThunk;

const productCategoriesSlice = createSlice({
  name: 'PRODUCT_CATEGORY',
  initialState: {
    productCategories: [],
    loading: false,
    message: '',
    success: false,
    error: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getproductCategories.pending, (state) => {
        state.loading = true;
      })
      .addCase(getproductCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.productCategories = action.payload;
        state.success = true;
      });
  },
});

export default productCategoriesSlice.reducer;

import { createSlice } from '@reduxjs/toolkit';
import { productActionThunk } from '../actions/product-action';

const { getProduct } = productActionThunk;

const productSilce = createSlice({
  name: 'PRODUCT',
  initialState: {
    products: [],
    loading: false,
    message: '',
    success: false,
    error: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(getProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      });
  },
});

export default productSilce.reducer;

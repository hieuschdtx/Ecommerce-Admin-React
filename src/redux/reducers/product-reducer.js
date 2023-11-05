import { createSlice } from '@reduxjs/toolkit';
import { productActionThunk } from '../actions/product-action';

const { getProduct, getProductPrices } = productActionThunk;

const productSilce = createSlice({
  name: 'PRODUCT',
  initialState: {
    products: [],
    productPrices: [],
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
      })
      .addCase(getProductPrices.pending, (state) => {
        state.loading = true;
      })
      .addCase(getProductPrices.fulfilled, (state, action) => ({
        ...state,
        productPrices: action.payload,
      }));
  },
});

export default productSilce.reducer;

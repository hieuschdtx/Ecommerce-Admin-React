import { createSlice } from '@reduxjs/toolkit';
import { productActionThunk } from '../actions/product-action';

const { getProduct, getProductPrices, getPriceByProductId, getProductById } = productActionThunk;

const productSilce = createSlice({
  name: 'PRODUCT',
  initialState: {
    products: [],
    productPrices: [],
    loading: false,
    message: '',
    success: false,
    error: false,
    getPriceById: [],
    getProductById: [],
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
      }))

      .addCase(getPriceByProductId.pending, (state, action) => ({
        ...state,
      }))
      .addCase(getPriceByProductId.fulfilled, (state, action) => ({
        ...state,
        loading: false,
        getPriceById: action.payload,
      }))
      // .addCase(getPriceByProductId.rejected, (state, action) => ({
      //   ...state,
      //   getPriceById: {
      //     ...apiState,
      //     loading: false,
      //     message: { type: action.type, message: action.error.message },
      //   },
      // }))

      .addCase(getProductById.pending, (state, action) => ({
        ...state,
        loading: true,
      }))
      .addCase(getProductById.fulfilled, (state, action) => ({
        ...state,
        loading: false,
        getProductById: action.payload,
      }));
    // .addCase(getProductById.rejected, (state, action) => ({
    //   ...state,
    //   getProductById: {
    //     ...apiState,
    //     loading: false,
    //     message: { type: action.type, message: action.error.message },
    //   },
    // }));
  },
});

export default productSilce.reducer;

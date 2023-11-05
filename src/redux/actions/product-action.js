import { createAsyncThunk } from '@reduxjs/toolkit';
import { productService } from 'src/apis/product-service';

const getProduct = createAsyncThunk('PRODUCTS_GET_PRODUCTS', async () => {
  const { data } = await productService.getAllProducts();
  return data;
});
const getProductPrices = createAsyncThunk('PRODUCT_PRICES_GET_PRODUCT_PRICES', async () => {
  const { data } = await productService.getAllProductPrices();
  return data;
});

export const productActionThunk = {
  getProduct,
  getProductPrices,
};

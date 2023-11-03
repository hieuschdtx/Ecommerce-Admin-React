import { createAsyncThunk } from '@reduxjs/toolkit';
import { productService } from 'src/apis/product-service';

const getProduct = createAsyncThunk('PRODUCTS_GET_PRODUCTS', async () => {
  const { data } = await productService.getAllProducts();
  return data;
});

export const productActionThunk = {
  getProduct,
};

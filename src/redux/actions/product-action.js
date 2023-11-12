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

const getPriceByProductId = createAsyncThunk(
  'PRODUCT_PRICES_GET_BY_ID_PRODUCT_PRICES',
  async (p) => {
    const { data } = await productService.getPriceByProductId(p);
    return data;
  }
);

const getProductById = createAsyncThunk('PRODUCT_GET_BY_ID_PRODUCTS', async (p) => {
  const { data } = await productService.getProductById(p);
  return data;
});

export const productActionThunk = {
  getProduct,
  getProductPrices,
  getPriceByProductId,
  getProductById,
};

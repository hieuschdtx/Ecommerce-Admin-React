import { createAsyncThunk } from '@reduxjs/toolkit';
import { productCategoriesService } from 'src/apis/product-categories-service';

const getproductCategories = createAsyncThunk(
  'PRODUCT_CATEGORIES_GET_PRODUCT_CATEGORIES',
  async () => {
    const data = await productCategoriesService.getProductCategories();
    return data;
  }
);

export const productCategoriesActionThunk = {
  getproductCategories,
};

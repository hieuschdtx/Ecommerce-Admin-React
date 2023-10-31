import { callApi, methods } from 'src/utils/api-config';

export const productCategoriesService = {
  getProductCategories: async () => {
    const headers = { 'Content-Type': 'application/json' };
    const data = await callApi('v1/product-category/get-all', methods.get, headers, null);
    return data;
  },
  createProductCategory: async (body) => {
    const headers = { 'Content-Type': 'application/json' };
    const data = await callApi('v1/product-category/create', methods.post, headers, body);
    return data;
  },
  deleteProductCategory: async (id) => {
    const headers = { 'Content-Type': 'application/json' };
    const data = await callApi(`v1/product-category?id=${id}`, methods.delete, headers, null);
    return data;
  },
};

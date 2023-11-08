import { callApi, methods } from 'src/utils/api-config';

export const productService = {
  getAllProducts: async () => {
    const headers = { 'Content-Type': 'application/json' };
    const data = await callApi('v1/product/get-all', methods.get, headers, null);
    return data;
  },
  getAllProductPrices: async () => {
    const headers = { 'Content-Type': 'application/json' };
    const data = await callApi('v1/product/price', methods.get, headers, null);
    return data;
  },
  CreateNewProduct: async (body) => {
    const headers = { 'Content-Type': 'multipart/form-data' };
    const data = await callApi('v1/product/create', methods.post, headers, body);
    return data;
  },
  CreatePriceProduct: async (id, body) => {
    const headers = { 'Content-Type': 'application/json' };
    const data = await callApi(
      `v1/product/create-price?productId=${id}`,
      methods.post,
      headers,
      body
    );
    return data;
  },
};

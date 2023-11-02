import { callApi, methods } from 'src/utils/api-config';

export const productService = {
  getAllProducts: async () => {
    const headers = { 'Content-Type': 'application/json' };
    const data = await callApi('v1/product/get-all', methods.get, headers, null);
    return data;
  },
};

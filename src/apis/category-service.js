import { callApi, methods } from 'src/utils/api-config';

export const CategoryService = {
  getAllProducts: async () => {
    const headers = { 'Content-Type': 'application/json' };
    const data = await callApi('v1/category/get-all', methods.get, headers, null);
    return data;
  },
};

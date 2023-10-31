import { callApi, methods } from 'src/utils/api-config';

export const CategoryService = {
  GetAllCategories: async () => {
    const headers = { 'Content-Type': 'application/json' };
    const data = await callApi('v1/category/get-all', methods.get, headers, null);
    return data;
  },
  CreateCategory: async (body) => {
    const headers = { 'Content-Type': 'application/json' };
    const data = await callApi('v1/category/create', methods.post, headers, body);
    return data;
  },
  DeleteCategory: async (id) => {
    const headers = { 'Content-Type': 'application/json' };
    const data = await callApi(`v1/category/delete?id=${id}`, methods.delete, headers, null);
    return data;
  },
  UpdateCategory: async (id, body) => {
    const headers = { 'Content-Type': 'application/json' };
    const data = await callApi(`v1/category/update?id=${id}`, methods.put, headers, body);
    return data;
  },
};

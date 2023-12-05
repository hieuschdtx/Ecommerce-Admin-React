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
  UpdateCategory: async (p) => {
    const headers = { 'Content-Type': 'application/json' };
    const data = await callApi(`v1/category/update?id=${p.id}`, methods.put, headers, p);
    return data;
  },
};

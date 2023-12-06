import { callApi, methods } from 'src/utils/api-config';

export const promotionService = {
  getPromotion: async () => {
    const headers = { 'Content-Type': 'application/json' };
    const data = await callApi('v1/promotion/get-all', methods.get, headers, null);
    return data;
  },
  createPromotion: async (body) => {
    const headers = { 'Content-Type': 'application/json' };
    const data = await callApi('v1/promotion/create', methods.post, headers, body);
    return data;
  },
  deleteProductCategory: async (id) => {
    const headers = { 'Content-Type': 'application/json' };
    const data = await callApi(`v1/promotion?id=${id}`, methods.delete, headers, null);
    return data;
  },
  updatePromotion: async (p) => {
    const headers = { 'Content-Type': 'application/json' };
    const data = await callApi(`v1/promotion/update?id=${p.id}`, methods.put, headers, p);
    return data;
  },
};

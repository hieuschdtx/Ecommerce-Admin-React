import { callApi, methods } from 'src/utils/api-config';

export const promotionService = {
  getPromotion: async () => {
    const headers = { 'Content-Type': 'application/json' };
    const data = await callApi('v1/promotion/get-all', methods.get, headers, null);
    return data;
  },
};

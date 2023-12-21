import { HEADERS_TYPE } from 'src/resources/common';
import { callApi, methods } from 'src/utils/api-config';

export const statistiqueService = {
  getMonthlyRevenue: async (p) =>
    await callApi(
      `v1/statistique/revenue?month=${p.month}&year=${p.year}`,
      methods.get,
      HEADERS_TYPE.json,
      null
    ),
  getTotalAmountRevenue: async (p) =>
    await callApi(`v1/statistique/${p.year}/revenue`, methods.get, HEADERS_TYPE.json, null),
  getCountOrderProductByProcategory: async () =>
    await callApi('v1/statistique/order-count-product', methods.get, HEADERS_TYPE.json, null),
  CountOrderMonthOfYear: async (p) =>
    await callApi(
      `v1/statistique/${p.year}/order?month=${p.month}`,
      methods.get,
      HEADERS_TYPE.json,
      null
    ),
};

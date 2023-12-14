import { HEADERS_TYPE } from 'src/resources/common';
import { callApi, methods } from 'src/utils/api-config';

export const orderService = {
  GetAllOrder: async () => await callApi('v1/order/get-all', methods.get, HEADERS_TYPE.json, null),
  FilterOrderDetail: async (p) =>
    await callApi(`v1/order/${p.id}/detail`, methods.get, HEADERS_TYPE.json, null),
  GetOrderById: async (p) =>
    await callApi(`v1/order?id=${p.id}`, methods.get, HEADERS_TYPE.json, null),
  UpdateOrder: async (p) =>
    await callApi(`v1/order/${p.id}/update`, methods.put, HEADERS_TYPE.json, p),
};

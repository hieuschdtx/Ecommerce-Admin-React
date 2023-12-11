import { HEADERS_TYPE } from 'src/resources/common';
import { callApi, methods } from 'src/utils/api-config';

export const orderService = {
  GetAllOrder: async () => await callApi('v1/order/get-all', methods.get, HEADERS_TYPE.json, null),
};

import { HEADERS_TYPE } from 'src/resources/common';
import { callApi, methods } from 'src/utils/api-config';

export const newsService = {
  getAllNews: async () => await callApi('v1/news', methods.get, HEADERS_TYPE.json, null),
  getDetails: async (p) =>
    await callApi(`v1/news/${p.id}/detail`, methods.get, HEADERS_TYPE.json, null),
};

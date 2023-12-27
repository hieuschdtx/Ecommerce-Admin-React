import { HEADERS_TYPE } from 'src/resources/common';
import { callApi, methods } from 'src/utils/api-config';

export const newsService = {
  getAllNews: async () => await callApi('v1/news', methods.get, HEADERS_TYPE.json, null),
  getDetails: async (p) =>
    await callApi(`v1/news/${p.id}/detail`, methods.get, HEADERS_TYPE.json, null),
  createNews: async (p) => await callApi('v1/news/create', methods.post, HEADERS_TYPE.multipart, p),
  deleteNews: async (p) =>
    await callApi(`v1/news/${p.id}/delete`, methods.delete, HEADERS_TYPE.json, null),
  updateUser: async (p) =>
    await callApi(`v1/news/update?id=${p.get('id')}`, methods.put, HEADERS_TYPE.multipart, p),
};

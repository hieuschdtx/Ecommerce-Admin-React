/* eslint-disable no-return-await */
import { HEADERS_TYPE } from 'src/resources/common';
import { callApi, methods } from 'src/utils/api-config';

const { json, multipart } = HEADERS_TYPE;
const URI = 'v1/product/';

export const productService = {
  getAllProducts: async () => await callApi(`${URI}get-all`, methods.get, json, null),
  getAllProductPrices: async () => await callApi(`${URI}price`, methods.get, json, null),
  CreateNewProduct: async (body) => await callApi(`${URI}create`, methods.post, multipart, body),
  CreatePriceProduct: async (id, body) =>
    await callApi(`${URI}create-price?productId=${id}`, methods.post, multipart, body),
  getProductById: async (p) => await callApi(`${URI}?id=${p}`, methods.get, json, null),
  getPriceByProductId: async (p) =>
    await callApi(`${URI}price/listing?id=${p}`, methods.get, json, null),
  UpdateImageProduct: async (p) =>
    await callApi(`${URI}update-image?id=${p.get('id')}`, methods.put, multipart, p),
  DelteImageProduct: async (p) =>
    await callApi(`${URI}delete-image?id=${p.get('id')}`, methods.delete, multipart, p),
  UpdatePriceProduct: async (p) =>
    await callApi(`${URI}update-price?id=${p.get('id')}`, methods.put, multipart, p),
  UpdateProduct: async (p) =>
    await callApi(`${URI}update?id=${p.get('id')}`, methods.put, multipart, p),
};

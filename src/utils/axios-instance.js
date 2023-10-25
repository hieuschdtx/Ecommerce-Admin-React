import axios from 'axios';
import { jwtConst } from 'src/resources/jwt-const';
import { storage } from './storage';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const methods = {
  get: 'get',
  post: 'post',
  put: 'put',
  delete: 'delete',
};

const callApi = async (path, method, headers, body) => {
  const url = `${BACKEND_URL}${path}`;
  const resp = await axiosInstance(url, {
    method,
    headers,
    data: body ? JSON.stringify(body) : undefined,
  });
  const data = await resp.data;
  return data;
};

const axiosInstance = axios.create({
  baseURL: BACKEND_URL,
  withCredentials: true,
});

export const publicApi = async (path, method = 'get', body) => {
  const headers = { 'Content-Type': 'application/json' };
  const data = await callApi(path, method, headers, body);
  console.log('data', data);
  return data;
};

export const privateApi = async (path, method, token = null, body = null) => {
  const headers = { 'Content-Type': 'application/json' };
  if (!token) {
    token = storage.getCache(jwtConst.token);
  }

  // eslint-disable-next-line dot-notation
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const data = await callApi(path, method, headers, body);
  console.log('privateApi', data);
  return data;
};

export const privatePost = async (path, token = null, body = null) => {
  const data = await privateApi(path, methods.post, token, body);
  return data;
};

export const privatePut = async (path, token = null, body = null) => {
  const data = await privateApi(path, methods.put, token, body);
  return data;
};

export { axiosInstance };

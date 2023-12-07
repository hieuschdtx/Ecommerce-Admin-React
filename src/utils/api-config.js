import axios from 'axios';
import { auth } from './auth';
import { storage } from './storage';
import { jwtConst } from 'src/resources/jwt-const';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
export const methods = {
  get: 'get',
  post: 'post',
  put: 'put',
  delete: 'delete',
};

export const callApi = async (path, method, headers, body) => {
  const url = `${BACKEND_URL}${path}`;
  try {
    const resp = await axios(url, {
      method,
      headers: {
        ...headers,
        Authorization: `Bearer ${storage.getCache(jwtConst.token)}`,
      },
      data: body,
      withCredentials: true,
    });
    const { data, status } = resp;
    return { data, status };
  } catch (error) {
    if (error.response) {
      const { data, status } = error.response;
      return { data, status };
    }

    throw error.message;
  }
};

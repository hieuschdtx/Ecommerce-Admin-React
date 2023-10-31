import axios from 'axios';

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
      headers,
      data: body,
      withCredentials: true,
    });
    const { data } = resp;
    return data;
  } catch (error) {
    if (error.response) {
      return error.response.data;
    }

    throw error.message;
  }
};

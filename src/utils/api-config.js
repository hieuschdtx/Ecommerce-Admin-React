import axios from 'axios';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
export const methods = {
  get: 'get',
  post: 'post',
  put: 'put',
  delete: 'delete',
};

export const callApi = async (path, method, headers, body) => {
  console.log(headers);
  const url = `${BACKEND_URL}${path}`;
  const resp = await axios(url, {
    method,
    headers,
    data: body,
    withCredentials: true,
  });
  const data = await resp.data;
  return data;
};

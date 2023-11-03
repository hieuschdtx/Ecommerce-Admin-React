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
    const { data, status } = resp;
    return { data, status };
  } catch (error) {
    if (error.response) {
      console.log(error.response);
      const { data, status } = error.response;
      return { data, status };
    }

    throw error.message;
  }
};

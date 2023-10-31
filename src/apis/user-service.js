import { methods, callApi } from 'src/utils/api-config';

export const userService = {
  GetAllUsers: async () => {
    const headers = { 'Content-Type': 'application/json' };
    const data = await callApi('v1/user/get-all', methods.get, headers, null);
    return data;
  },

  CreateNewUser: async (body) => {
    const headers = { 'Content-Type': 'multipart/form-data' };
    const data = callApi('v1/user/create', methods.post, headers, body);
    return data;
  },

  GetAllRoles: async () => {
    const headers = { 'Content-Type': 'application/json' };
    const data = await callApi('v1/role/get-all', methods.get, headers, null);
    return data;
  },

  LoginUser: async (body) => {
    const headers = { 'Content-Type': 'application/json' };
    const data = await callApi('v1/user/login', methods.post, headers, body);
    return data;
  },
  LogoutUser: async () => {
    const headers = { 'Content-Type': 'application/json' };
    const data = await callApi('v1/user/logout', methods.post, headers, null);
    return data;
  },
};

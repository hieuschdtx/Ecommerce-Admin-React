import { HEADERS_TYPE } from 'src/resources/common';
import { methods, callApi } from 'src/utils/api-config';

export const userService = {
  GetAllUsers: async () => await callApi('v1/user/get-all', methods.get, HEADERS_TYPE.json, null),
  CreateNewUser: async (body) =>
    await callApi('v1/user/create', methods.post, HEADERS_TYPE.multipart, body),
  GetAllRoles: async () => await callApi('v1/role/get-all', methods.get, HEADERS_TYPE.json, null),
  LoginUser: async (body) => await callApi('v1/user/login', methods.post, HEADERS_TYPE.json, body),
  LogoutUser: async () => await callApi('v1/user/logout', methods.post, HEADERS_TYPE.json, null),
  getUserById: async (p) =>
    await callApi(`v1/user?id=${p.id}`, methods.get, HEADERS_TYPE.json, null),
  getRoleById: async (p) =>
    await callApi(`v1/role?id=${p.id}`, methods.get, HEADERS_TYPE.json, null),
  updateUser: async (p) =>
    await callApi(`v1/user/update?id=${p.get('id')}`, methods.put, HEADERS_TYPE.multipart, p),
};

import { axiosInstance, methods, publicApi } from 'src/utils/axios-instance';

const userService = {
  GetAllUsers: async () => {
    // const resp = axiosInstance.get('v1/user/get-all');
    // return resp;
    const data = await publicApi('v1/user/get-all', methods.get, null);
    console.log(data);
    return data;
  },

  CreateNewUser: async (data) => {
    const resp = axiosInstance.post('v1/user/create', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
        timeout: 1000,
      },
    });
    return resp;
  },

  GetAllRoles: async () => {
    const data = await publicApi('v1/role/get-all', methods.get, null);
    console.log(data);
    return data;
  },

  LoginUser: async (body) => {
    // const resp = axiosInstance.post('v1/user/login', body, {
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    // });
    // const data = await resp.json();
    // return data;
    const data = await publicApi('v1/user/login', methods.post, body);
    return data;
  },
};

export { userService };

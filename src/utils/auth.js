import jwtDecode from 'jwt-decode';
import { jwtConst } from 'src/resources/jwt-const';
import { storage } from './storage';
import { roleConst } from 'src/resources/role';

export const auth = {
  deCodeTokenUser: (token) => {
    return jwtDecode(token);
  },

  SetUserInfo: (token) => {
    if (token) {
      const decodedToken = auth.deCodeTokenUser(token);
      storage.setCache(jwtConst.user, decodedToken);
    }
  },

  GetUserInfo: () => storage.getCache(jwtConst.user),

  CheckExprise: () => {
    const user = storage.getCache(jwtConst.user);
    if (!user) return false;
    try {
      const currentTimestamp = Math.floor(Date.now() / 1000);
      return user.exp >= currentTimestamp;
    } catch (error) {
      return false;
    }
  },
  GetAccess: (token) => {
    const decodedToken = auth.deCodeTokenUser(token);
    if (!decodedToken) return false;

    const role = decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
    return role !== roleConst.employee;
  },
};

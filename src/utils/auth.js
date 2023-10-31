import jwtDecode from 'jwt-decode';
import { jwtConst } from 'src/resources/jwt-const';
import { storage } from './storage';

export const auth = {
  SetUserInfo: (token) => {
    if (token) {
      const decodedToken = jwtDecode(token);
      storage.setCache(jwtConst.user, decodedToken);
    }
  },
  GetUserInfo: () => storage.getCache(jwtConst.user),
  CheckExprise: () => {
    const token = storage.getCache(jwtConst.token);
    if (!token) return false;
    try {
      const decodedToken = jwtDecode(token);
      if (!decodedToken) return false;

      const currentTimestamp = Math.floor(Date.now() / 1000);
      return decodedToken.exp >= currentTimestamp;
    } catch (error) {
      return false;
    }
  },
  GetAccess: () => {
    const token = storage.getCache(jwtConst.token);
    if (!token) return false;
    try {
      const decodedToken = jwtDecode(token);
      if (!token) return false;

      const role = decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
      return role !== 'guest';
    } catch (error) {
      return false;
    }
  },
};

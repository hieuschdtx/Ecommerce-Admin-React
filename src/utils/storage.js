export const storage = {
  setCache: (key, v) => {
    localStorage.setItem(key, JSON.stringify(v));
  },

  getCache: (key) => {
    try {
      const s = localStorage.getItem(key);
      return JSON.parse(s);
    } catch (error) {
      return null;
    }
  },

  removeCache: (key) => {
    localStorage.removeItem(key);
  },
};

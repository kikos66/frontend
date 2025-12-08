import AxiosHelper from "./axios_helper.js"

const AuthAPI = {
  login: async (email, password) => {
    const res = await AxiosHelper.post("/auth/login", { email, password });
    localStorage.setItem("accessToken", res.data.accessToken); 
    return res.data;
  },

  register: async (username, email, password) => {
    return AxiosHelper.post("/auth/register", { username, email, password });
  },

  logout: async () => {
    try {
      await AxiosHelper.post("/auth/logout"); 
    } finally {
      localStorage.removeItem("accessToken");
    }
  },
};

export default AuthAPI;
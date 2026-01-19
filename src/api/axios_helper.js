import axios from 'axios';

const AxiosHelper = axios.create({
    baseURL: "http://localhost:8080/api",
    withCredentials: true
});

AxiosHelper.interceptors.request.use((req) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
        req.headers.Authorization =  `Bearer ${token}`;
    }
    return req;
});

AxiosHelper.interceptors.response.use(
  (res) => res,
  async (err) => {
    const original = err.config;

    const isAuthEndpoint =
      original.url.includes("/auth/login") ||
      original.url.includes("/auth/register") ||
      original.url.includes("/auth/refresh");

    if (
      err.response?.status === 401 &&
      !original._retry &&
      !isAuthEndpoint
    ) {
      original._retry = true;

      try {
        const res = await AxiosHelper.post("/auth/refresh");
        const newToken = res.data.accessToken;

        localStorage.setItem("accessToken", newToken);

        AxiosHelper.defaults.headers.Authorization = `Bearer ${newToken}`;
        original.headers.Authorization = `Bearer ${newToken}`;

        return AxiosHelper(original);
      } catch (refreshErr) {
        // refresh failed → logout
        localStorage.removeItem("accessToken");
        window.location.href = "/login";
        return Promise.reject(refreshErr);
      }
    }

    return Promise.reject(err);
  }
);

export default AxiosHelper;
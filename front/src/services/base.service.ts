import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_API_URL,
});


  

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(import.meta.env.VITE_TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    //const originalRequest = err.config;

    if (err.response?.status !== 401) {
      return Promise.reject(err);
    }


  }

);

export default api;

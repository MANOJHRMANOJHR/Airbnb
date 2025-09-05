import axios from 'axios';
/* LINE 2*/
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  /*LINE 3*/
  withCredentials: true,
});

export default axiosInstance;

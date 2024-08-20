import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://f502-14-194-85-214.ngrok-free.app/api',
  headers: {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true'
  }
});

export default axiosInstance;

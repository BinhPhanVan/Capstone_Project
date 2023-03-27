import axios from "axios";
import { handleError } from "../utils/handleError";

const httpRequest = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

httpRequest.interceptors.request.use(
  (config) => {
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);
httpRequest.interceptors.response.use(
  (response) => {
    return response.data;
  },
  function (error) {
    const message = handleError(error);
    return Promise.reject({ message: message });
  }
);
export default httpRequest;

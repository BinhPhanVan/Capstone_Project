import axios from "axios";
import store from "../store"
const httpRequest = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const getCurrentAccount = () =>
{
    return store.getState().auth.account;
}

httpRequest.interceptors.request.use(
  (config) => {
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

httpRequest.interceptors.request.use(
  (request) => {const account = getCurrentAccount()
    if (account) 
    {
      const { access_token } = account;
      request.headers["Authorization"] = `Bearer ${access_token}`;
    }
    return request
  }
);

httpRequest.interceptors.request.use(
  (request) =>
    {
        if (!request.url.endsWith('/')) {
            request.url += '/'
        }
        return request;
    }
);

httpRequest.interceptors.response.use(
  (response) => {
    return response.data;
  }
);
export default httpRequest;

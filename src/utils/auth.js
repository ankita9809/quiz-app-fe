import axios from "axios";
import ENV from "../env";
import { Navigate } from "react-router-dom";
import { selectToken } from "../redux/slice/userSlice";
import store from "../redux/store/store";

const auth = axios.create({
  baseURL: ENV.baseUrl,
  timeout: 50000,
});

auth.interceptors.request.use((config) => {
  const token = selectToken(store.getState());
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

auth.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // console.log("auth error", error);
    if (error.response.status === 401) {
      window.localStorage.clear();
      window.location = "/login";
    }
  }
);

export default auth;

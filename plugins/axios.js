import axios from "axios";

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig();

  const api = axios.create({
    baseURL: config.public.axiosBase,
    withCredentials: true,
  });

  api.interceptors.response.use(
    (response) => response.data, () => {
      return null;
    }
  );

  nuxtApp.provide("axios", api);
});
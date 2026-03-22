import axios from "axios";

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig();

  const api = axios.create({
    baseURL: config.public.axiosBase,
    withCredentials: true,
  });

  api.interceptors.response.use(
    (response) => response.data,
    (error) => {
      if (error.response) {
        if (error.response.status === 400 || error.response.status === 410) {
          const errors = error.response.data?.errors;
          if (errors) {
            Object.values(errors).forEach((messages) => {
              messages.forEach((message) => {
                nuxtApp.$toast.warning(message);
              });
            });
          }
        } else if (error.response.status === 403) {
          window.location.href = "/";
        }
      } else {
        console.error("Error:", error);
      }

      return Promise.reject(error);
    }
  );

  nuxtApp.provide("axios", api);
});
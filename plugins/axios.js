import axios from "axios";

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig();
  const { set } = useErrorMessage();
  const api = axios.create({
    baseURL: config.public.axiosBase,
    withCredentials: true,
  });

  api.interceptors.request.use((config) => {
    if (config.url?.startsWith("/")) {
      config.url = config.url.slice(1);
    }
    return config;
  });

  api.interceptors.response.use(
    (response) => {
      const data = response.data;

      if (data?.ShowToast && data?.ShowToast == true) {
        nuxtApp.$toast.success("Success");
      }

      return data;
    },
    (error) => {
      const status = error.response?.status;
      const message = error.response?.data?.Message || "Internal Server Error";

      if (status === 400) {
        nuxtApp.$toast.warning(message);
        console.warn("Warning:", message);
        return null;
      } else if (status === 401) {
        set(message);
        nuxtApp.$auth.logoutAuth();
      } else if (status === 403) {
        set(message);
        navigateTo("/error");
      } else if (status === 404) {
        set(message);
        nuxtApp.$auth.logoutAuth();
      } else {
        nuxtApp.$toast.error(message);
      }
      console.error("Error:", message);

      return null;
    },
  );

  nuxtApp.provide("axios", api);
});

import { createAuth0 } from '@auth0/auth0-vue';

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig();

  const auth0 = createAuth0({
    domain: config.public.auth0Domain,
    clientId: config.public.auth0ClientId,
    authorizationParams: {
      redirect_uri: window.location.origin + '/callback',
      scope: 'openid profile email offline_access',
    },
    cacheLocation: 'localstorage',
    useRefreshTokens: true
  });

  nuxtApp.vueApp.use(auth0);
});
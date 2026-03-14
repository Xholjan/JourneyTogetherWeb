import { useAuth0 } from '@auth0/auth0-vue';

export default defineNuxtRouteMiddleware(async () => {
  const { isAuthenticated, isLoading } = useAuth0();

  if (isLoading.value) return;
  if (!isAuthenticated.value) {
    return navigateTo('/login');
  }
});
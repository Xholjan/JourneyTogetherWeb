export default defineNuxtRouteMiddleware(async () => {
  const { $auth0 } = useNuxtApp()

  const logged = await $auth0.isAuthenticated()
  debugger
  if (!logged) {
    await $auth0.loginWithRedirect()
  }
})
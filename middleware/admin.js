import { defineNuxtRouteMiddleware, navigateTo } from '#app'
import { useAuth0 } from '@auth0/auth0-vue'
import { useAdmin } from '@/composables/useAdmin'

export default defineNuxtRouteMiddleware(async () => {
    const { isAuthenticated } = useAuth0()
    const { getAdmin } = useAdmin()

    if (!isAuthenticated.value) {
        return navigateTo('/')
    }

    try {
        const result = await getAdmin()
        if (!result) {
            return navigateTo('/')
        }
    } catch (err) {
        return navigateTo('/')
    }
})
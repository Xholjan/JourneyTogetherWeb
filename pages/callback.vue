<script setup>
import { useAuth0 } from '@auth0/auth0-vue'
const { isAuthenticated, isLoading } = useAuth0()
const router = useRouter()

watch([isLoading, isAuthenticated], ([loading, authenticated]) => {
    if (!loading && authenticated) {
        router.replace('/')
    }
})

</script>
<template>
    <div>Logging you in...</div>
</template>
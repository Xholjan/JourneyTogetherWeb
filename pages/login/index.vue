<script setup>
import { useAuth0 } from '@auth0/auth0-vue'

const { loginWithRedirect } = useAuth0()

const login = () => {
    loginWithRedirect()
}

</script>

<template>
    <button @click="login">Log In</button>
</template>
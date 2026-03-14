<script setup lang="ts">
import { onMounted } from 'vue'

const { $auth0 } = useNuxtApp()

const signup = () =>
    $auth0.loginWithRedirect({ authorizationParams: { screen_hint: 'signup' } })

const login = () => $auth0.loginWithRedirect()

const logout = () =>
    $auth0.logout({ logoutParams: { returnTo: window.location.origin } })

onMounted(async () => {
    console.log('User:', $auth0.user)
    console.log('isLoading:', $auth0.isLoading)
    console.log('isAuthenticated:', await $auth0.isAuthenticated())
})
</script>

<template>
    <div v-if="$auth0.isLoading">Loading...</div>

    <div v-else-if="$auth0.isAuthenticated && $auth0.user">
        <p>Logged in as {{ $auth0.user.email }}</p>

        <h1>User Profile</h1>

        <pre>{{ JSON.stringify($auth0.user, null, 2) }}</pre>

        <button @click="logout">Logout</button>
    </div>

    <div v-else>
        <p v-if="$auth0.error">Error: {{ $auth0.error.message }}</p>

        <button @click="signup">Signup</button>

        <button @click="login">Login</button>
    </div>
</template>

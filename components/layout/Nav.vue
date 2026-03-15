<script setup>
import { useAuth0 } from '@auth0/auth0-vue'
const { isAuthenticated, loginWithRedirect, logout } = useAuth0()
</script>

<template>
    <nav class="app-navbar">
        <div class="nav-container">
            <div class="nav-logo">
                <NuxtLink to="/">JourneyTogether</NuxtLink>
            </div>

            <div class="nav-buttons">
                <button v-if="!isAuthenticated.valueOf()" class="btn-base btn-login" @click="loginWithRedirect">
                    Log In
                </button>

                <button v-if="isAuthenticated.valueOf()" class="btn-base btn-logout" @click="logout">
                    Log Out
                </button>
            </div>
        </div>
    </nav>
</template>
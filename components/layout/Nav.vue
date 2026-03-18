<script setup>
import { useAuth0 } from '@auth0/auth0-vue'
import { useUsers } from '../../composables/useUsers';

const { $toast } = useNuxtApp();
const { isAuthenticated, loginWithRedirect, logout } = useAuth0()
const { $signalr } = useNuxtApp();
const { syncUser } = useUsers();

watch(isAuthenticated, async (value) => {
    if (value) {
        await $signalr.start();
        var status = await syncUser();
        if (status != 0) {
            $toast.error('Your account is not valid. Please contact support.')
            await logout();
        }
    }
}, { immediate: true });
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
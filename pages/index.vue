<script setup>
import { useAuth0 } from '@auth0/auth0-vue'
import { onMounted } from 'vue'
import { useJourneys } from '~/composables/useJourneys';

definePageMeta({
    middleware: "auth"
})

const { logout } = useAuth0()
const journeys = ref([]);
const { getJourneys } = useJourneys();

const handleLogout = () => {
    logout({
        logoutParams: {
            returnTo: window.location.origin + '/login'
        }
    })
}

onMounted(async () => {
    const response = await getJourneys(1, 10);
    console.log(response);
    journeys.value = response;
});
</script>

<template>
    <div class="container">
        <h1>Home</h1>

        <button @click="handleLogout">
            Logout
        </button>
    </div>
</template>
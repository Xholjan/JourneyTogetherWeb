<template>
    <div class="error-page">
        <h1 class="error-code">403</h1>
        <p class="error-message">Oops! You’re not allowed to view this page.</p>
        <NuxtLink to="/" class="error-button">
            Go Home
        </NuxtLink>
    </div>
</template>

<script setup>
definePageMeta({
    layout: false
})

import { onMounted } from 'vue';
const error = useErrorMessage();

onMounted(() => {
    if (error.message.value) {
        const { $toast } = useNuxtApp();
        $toast.error(error.message.value);
        error.clear();
    }
});
</script>
<script setup>
import { isRef } from 'vue';

const { $tt, $auth } = useNuxtApp();
const user = isRef($auth?.user) ? $auth.user.value : $auth?.user;

useHead({
    title: $tt(391) + ' - ' + user.InitData?.CompanyName
});
</script>

<template>
    <div class="container">
        <VerificationsContent />
    </div>
</template>
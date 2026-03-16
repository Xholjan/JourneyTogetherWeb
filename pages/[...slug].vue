<template>
    <CommonLoader v-if="isLoading" />
</template>

<script setup>
const isLoading = ref(true)

onMounted(() => {
    isLoading.value = false
    navigateTo('/', { replace: true })
})
</script>
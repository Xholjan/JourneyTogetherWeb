<template>
    <div>
        <p>Page not found. Redirecting...</p>
    </div>
</template>

<script setup>
onMounted(() => {
    navigateTo('/', { replace: true })
})
</script>
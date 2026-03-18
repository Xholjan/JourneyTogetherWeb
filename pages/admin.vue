<script setup>
definePageMeta({
    middleware: 'admin'
})
const refreshCounter = ref(0)
const showModal = ref(false)

const modifyUserStatus = () => {
    showModal.value = true
}
</script>

<template>
    <CommonCard containerClass="m-3" title="User Journeys">
        <template #header>
            <div class="d-flex justify-content-between align-items-center">
                <span>User Journeys</span>
                <button class="btn-base btn-login" @click="modifyUserStatus">
                    User Status
                </button>
            </div>
        </template>
        <AdminJourneys :refresh="refreshCounter" />
    </CommonCard>

    <CommonCard containerClass="m-3" title="Statistics">
        <template #header>
            <span>Statistics</span>
        </template>
        <AdminStatistics :refresh="refreshCounter" />
    </CommonCard>

    <AdminModal v-if="showModal" @close="showModal = false" />
</template>
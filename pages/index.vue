<script setup>
import { ref } from 'vue';
import { useAuth0 } from '@auth0/auth0-vue'

const { isAuthenticated } = useAuth0()
const showModal = ref(false)
const selectedJourneyId = ref(0)
</script>

<template>
    <div>
        <CommonCard containerClass="m-3">
            <div class="page-title">
                <h1 class="gradient-welcome">Welcome</h1>
            </div>
        </CommonCard>
    </div>
    <div v-if="isAuthenticated.valueOf()">
        <CommonCard containerClass="m-3" title="Your Journeys">
            <template #header>
                <div class="d-flex justify-content-between align-items-center">
                    <span>Your Journeys</span>
                    <button class="btn-base btn-login" @click="showModal = true">
                        Add
                    </button>
                </div>
            </template>
            <JourneyTable />
        </CommonCard>
    </div>

    <JourneyModal v-if="showModal" @close="showModal = false" :journeyId="selectedJourneyId" />
</template>
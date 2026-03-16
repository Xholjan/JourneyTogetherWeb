<script setup>
import { ref } from 'vue';
import { useAuth0 } from '@auth0/auth0-vue'

const { isAuthenticated } = useAuth0()
const { getJourneyById, deleteJourney } = useJourneys();
const showModal = ref(false)
const selectedJourneyId = ref(0)
const refreshCounter = ref(0)
const journey = ref(null)

const triggerRefresh = () => {
    debugger
    refreshCounter.value++
    if (selectedJourneyId.value > 0) {
        handleSelect(selectedJourneyId.value)
    } else {
        journey.value = null
    }
}

const handleSelect = async (journeyId) => {
    journey.value = await getJourneyById(journeyId);
}

const addJourney = () => {
    selectedJourneyId.value = 0
    showModal.value = true
}

const transportTypeLabel = (type) => {
    switch (type) {
        case 1: return 'Car'
        case 2: return 'Bike'
        case 3: return 'Walk'
        default: return 'Other'
    }
}

const toggleFavourite = (id) => {
    console.log("Toggle favourite for journey", id)
}

const editJourney = (id) => {
    selectedJourneyId.value = id
    showModal.value = true
}

const deleteJourneyAction = (id) => {
    deleteJourney(id)
    selectedJourneyId.value = 0
    triggerRefresh()
}

const shareJourney = (id) => {
    console.log("Share journey", id)
}

const copyLink = (id) => {
    const url = `${window.location.origin}/journeys/${id}`
    navigator.clipboard.writeText(url)
    console.log("Copied link:", url)
}
</script>

<template>
    <div>
        <CommonCard containerClass="m-3">
            <div v-if="journey == null"
                class="page-title fixed-card-body d-flex flex-column justify-content-center align-items-center text-center">
                <h1 class="gradient-welcome w-100">Welcome</h1>
                <h6 v-if="isAuthenticated.valueOf()" class="gradient-welcome w-100">Select a journey to view details
                </h6>
            </div>
            <div v-else class="page-title fixed-card-body">
                <div class="container border bg-light mt-3 p-3 rounded">
                    <div class="row text-center align-items-center">
                        <div class="col border-end py-2">
                            {{ journey.startLocation }}
                        </div>
                        <div class="col border-end py-2">
                            {{ journey.arrivalLocation }}
                        </div>
                        <div class="col border-end py-2">
                            {{ transportTypeLabel(journey.transportType) }}
                        </div>
                        <div class="col border-end py-2">
                            <button class="btn btn-outline-primary btn-sm" @click="editJourney(journey.id)">
                                <i class="fas fa-edit"></i>
                            </button>
                        </div>
                        <div class="col border-end py-2">
                            <button class="btn btn-outline-secondary btn-sm" @click="copyLink(journey.id)">
                                <i class="fas fa-link"></i>
                            </button>
                        </div>
                        <div class="col py-2">
                            <button class="btn btn-outline-success btn-sm" @click="toggleFavourite(journey.id)">
                                <i :class="journey.isFavourite ? 'fas fa-heart text-danger' : 'far fa-heart'"></i>
                            </button>
                        </div>
                    </div>
                    <div class="row text-center align-items-center">
                        <div class="col border-end py-2">
                            {{ new Date(journey.startTime).toLocaleString() }}
                        </div>
                        <div class="col border-end py-2">
                            {{ new Date(journey.arrivalTime).toLocaleString() }}
                        </div>
                        <div class="col border-end py-2">
                            {{ journey.distanceKm }} km
                        </div>
                        <div class="col border-end py-2">
                            <button class="btn btn-outline-danger btn-sm" @click="deleteJourneyAction(journey.id)">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                        <div class="col border-end py-2">
                            <button class="btn btn-outline-info btn-sm" @click="shareJourney(journey.id)">
                                <i class="fas fa-share-alt"></i>
                            </button>
                        </div>
                        <div class="col py-2">
                            <!-- Empty cell -->
                        </div>
                    </div>
                </div>
            </div>
        </CommonCard>
    </div>
    <div v-if="isAuthenticated.valueOf()">
        <CommonCard containerClass="m-3" title="Your Journeys">
            <template #header>
                <div class="d-flex justify-content-between align-items-center">
                    <span>Your Journeys</span>
                    <button class="btn-base btn-login" @click="addJourney">
                        Add
                    </button>
                </div>
            </template>
            <JourneyTable :refresh="refreshCounter" @select="handleSelect" />
        </CommonCard>
    </div>

    <JourneyModal v-if="showModal" @close="showModal = false" @refresh="triggerRefresh"
        :journeyId="selectedJourneyId" />
</template>
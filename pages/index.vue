<script setup>
import { ref } from 'vue';
import { useAuth0 } from '@auth0/auth0-vue'
import { useRoute } from 'vue-router';

const { $toast } = useNuxtApp();
const { isAuthenticated } = useAuth0()
const { getJourneyById, deleteJourney, publicLinkJourney, getPublicJourneyById, addFavourite, removeFavourite } = useJourneys();
const showJourneyModal = ref(false)
const showShareModal = ref(false)
const selectedJourneyId = ref(0)
const refreshCounter = ref(0)
const journey = ref(null)
const publicJourney = ref(null)
const publicLink = ref(null)
const publicJourneyId = ref(null)
const route = useRoute();

const triggerRefresh = () => {
    refreshCounter.value++
    if (selectedJourneyId.value > 0) {
        handleSelect(selectedJourneyId.value)
    } else {
        journey.value = null
    }
}

const handleSelect = async (journeyId) => {
    publicLink.value = null
    publicJourney.value = null
    journey.value = await getJourneyById(journeyId);
}

const addJourney = () => {
    selectedJourneyId.value = 0
    showJourneyModal.value = true
}

const transportTypeLabel = (type) => {
    switch (type) {
        case 1: return 'Car'
        case 2: return 'Bike'
        case 3: return 'Walk'
        default: return 'Other'
    }
}

const addFavouriteAction = async (id) => {
    await addFavourite(id)
    $toast.success('Done!')
    await handleSelect(id)
}

const removeFavouriteAction = async (id) => {
    await removeFavourite(id)
    $toast.success('Done!')
    await handleSelect(id)
}

const editJourney = (id) => {
    selectedJourneyId.value = id
    showJourneyModal.value = true
}

const deleteJourneyAction = async (id) => {
    await deleteJourney(id)
    $toast.success('Done!')
    selectedJourneyId.value = 0
    triggerRefresh()
}

const shareJourney = (id) => {
    selectedJourneyId.value = id
    showShareModal.value = true
    journey.value = null
}

const publicLinkAction = async (id) => {
    const link = await publicLinkJourney(id)
    publicLink.value = "http://localhost:3000/" + link
    $toast.success('Link Created!')
}

const copyLink = async () => {
    if (publicLink.value) {
        await navigator.clipboard.writeText(publicLink.value)
        $toast.success('Link copied to clipboard!')
    }
}

onMounted(async () => {
    const pj = route.query.pj;
    if (pj) {
        publicJourneyId.value = pj;
        publicJourney.value = await getPublicJourneyById(publicJourneyId.value);
    }
});
</script>

<template>
    <div>
        <CommonCard containerClass="m-3">
            <div v-if="journey == null">
                <div v-if="publicJourney == null"
                    class="page-title fixed-card-body d-flex flex-column justify-content-center align-items-center text-center">
                    <h1 class="gradient-welcome w-100">Welcome</h1>
                    <h6 v-if="isAuthenticated.valueOf()" class="gradient-welcome w-100">
                        Select a journey for details
                    </h6>
                    <h6 v-else class="gradient-welcome w-100">
                        Log in to view your journeys
                    </h6>
                </div>
                <div v-else>
                    <div class="container border bg-light mt-3 p-3 rounded">
                        <div class="row text-center align-items-center">
                            <div class="col border-end py-2">
                                {{ publicJourney.startLocation }}
                            </div>
                            <div class="col border-end py-2">
                                {{ publicJourney.arrivalLocation }}
                            </div>
                            <div class="col py-2">
                                {{ transportTypeLabel(publicJourney.transportType) }}
                            </div>
                        </div>
                        <div class="row text-center align-items-center">
                            <div class="col border-end py-2">
                                {{ new Date(publicJourney.startTime).toLocaleString() }}
                            </div>
                            <div class="col border-end py-2">
                                {{ new Date(publicJourney.arrivalTime).toLocaleString() }}
                            </div>
                            <div class="col py-2">
                                {{ publicJourney.distanceKm }} km
                            </div>
                        </div>
                    </div>
                </div>
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
                            <button class="btn btn-outline-secondary btn-sm" @click="editJourney(journey.id)"
                                title="Edit">
                                <i class="fas fa-edit"></i>
                            </button>
                        </div>
                        <div class="col border-end py-2">
                            <button class="btn btn-outline-secondary btn-sm"
                                @click="journey.isFavourite ? removeFavouriteAction(journey.id) : addFavouriteAction(journey.id)"
                                :title="journey.isFavourite ? 'Unfavourite' : 'Favourite'">
                                <i :class="journey.isFavourite ? 'fas fa-heart text-danger' : 'far fa-heart'"></i>
                            </button>
                        </div>
                        <div class="col py-2">
                            <button class="btn btn-outline-secondary btn-sm" @click="publicLinkAction(journey.id)"
                                title="Public Link">
                                <i class="fas fa-link"></i>
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
                            <button class="btn btn-outline-secondary btn-sm" @click="deleteJourneyAction(journey.id)"
                                title="Delete">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                        <div class="col border-end py-2">
                            <button class="btn btn-outline-secondary btn-sm" @click="shareJourney(journey.id)"
                                title="Share">
                                <i class="fas fa-share-alt"></i>
                            </button>
                        </div>
                        <div class="col py-2">
                            <button v-if="publicLink" class="btn btn-outline-secondary btn-sm" @click="copyLink"
                                title="Copy">
                                <i class="fas fa-copy"></i>
                            </button>
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

    <JourneyModal v-if="showJourneyModal" @close="showJourneyModal = false" @refresh="triggerRefresh"
        :journeyId="selectedJourneyId" />

    <ShareModal v-if="showShareModal" @close="showShareModal = false" @refresh="triggerRefresh"
        :journeyId="selectedJourneyId" />
</template>
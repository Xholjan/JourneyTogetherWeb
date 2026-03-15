<script setup>
import { ref, onMounted, watch } from 'vue';
import { useJourneys } from '~/composables/useJourneys';

const emit = defineEmits(['close', 'refresh']);
const props = defineProps({ journeyId: { type: Number, required: true } });

const { getJourneyById, createJourney, updateJourney } = useJourneys();

const isLoading = ref(false);
const shown = ref(true);

const todayLocal = () => {
    const dt = new Date();
    dt.setSeconds(0, 0);
    const offset = dt.getTimezoneOffset();
    const local = new Date(dt.getTime() - offset * 60 * 1000);
    return local.toISOString().slice(0, 16);
};

// Form
const form = ref({
    startLocation: '',
    arrivalLocation: '',
    startTime: todayLocal(),
    arrivalTime: todayLocal(),
    transportType: 1,
    distanceKm: 0
});

const loadJourney = async () => {
    if (props.journeyId > 0) {
        isLoading.value = true;
        const journey = await getJourneyById(props.journeyId);
        if (journey) form.value = { ...journey };
        isLoading.value = false;
    } else {
        form.value = {
            startLocation: '',
            arrivalLocation: '',
            startTime: todayLocal(),
            arrivalTime: todayLocal(),
            transportType: 1,
            distanceKm: 0
        };
    }
};

onMounted(loadJourney);
watch(() => props.journeyId, loadJourney);

const submit = async () => {
    isLoading.value = true;
    try {
        if (props.journeyId === 0) {
            await createJourney(form.value);
        } else {
            await updateJourney(props.journeyId, form.value);
        }
        emit('refresh');
        close();
    } catch (e) {
        console.error(e);
    } finally {
        isLoading.value = false;
    }
};

const close = () => {
    shown.value = false;
    emit('close');
};
</script>

<template>
    <Teleport to="body">
        <div v-if="shown" class="modal-wrapper">
            <div class="modal-backdrop fade show"></div>
            <div class="modal fade show" tabindex="-1" style="display: block;" role="dialog">
                <div class="modal-dialog modal-bottom modal-dialog-scrollable">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">{{ props.journeyId === 0 ? 'Create Journey' : 'Update Journey' }}
                            </h5>
                            <button type="button" class="btn-close clickable" @click="close"></button>
                        </div>

                        <div class="modal-body p-3">
                            <form @submit.prevent="submit" class="row g-3">
                                <div class="col-12 col-md-6">
                                    <label class="form-label">Start Location</label>
                                    <input type="text" v-model="form.startLocation" class="form-control" required />
                                </div>
                                <div class="col-12 col-md-6">
                                    <label class="form-label">Arrival Location</label>
                                    <input type="text" v-model="form.arrivalLocation" class="form-control" required />
                                </div>
                                <div class="col-12 col-md-6">
                                    <label class="form-label">Start Time</label>
                                    <input type="datetime-local" v-model="form.startTime" class="form-control"
                                        :clearable="false" required />
                                </div>
                                <div class="col-12 col-md-6">
                                    <label class="form-label">Arrival Time</label>
                                    <input type="datetime-local" v-model="form.arrivalTime" class="form-control"
                                        :clearable="false" required />
                                </div>
                                <div class="col-12 col-md-6">
                                    <label class="form-label">Transport Type</label>
                                    <select v-model="form.transportType" class="form-select">
                                        <option :value="1">Car</option>
                                        <option :value="2">Bike</option>
                                        <option :value="3">Walk</option>
                                        <option :value="4">Other</option>
                                    </select>
                                </div>
                                <div class="col-12 col-md-6">
                                    <label class="form-label">Distance (Km)</label>
                                    <input type="number" v-model.number="form.distanceKm" min="0" step="0.1"
                                        class="form-control" required />
                                </div>
                            </form>
                        </div>

                        <div class="modal-footer">
                            <button type="button" class="btn btn-success" @click="submit" :disabled="isLoading">
                                {{ props.journeyId === 0 ? 'Create' : 'Update' }}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </Teleport>
</template>

<style scoped></style>
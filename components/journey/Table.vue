<script setup>
import { ref, watch, onMounted } from 'vue'
import { useJourneys } from '~/composables/useJourneys'

const { getJourneys } = useJourneys()
const items = ref([])
const totalRows = ref(0)
const currentPage = ref(1)
const perPage = ref(10)
const isLoading = ref(false)
const perPageOptions = [10, 15, 20] // Options for rows per page

const columns = [
    { key: 'id', label: 'ID', sortable: true },
    { key: 'startLocation', label: 'Start Location', sortable: true },
    { key: 'startTime', label: 'Start Time', sortable: true },
    { key: 'arrivalLocation', label: 'Arrival Location', sortable: true },
    { key: 'arrivalTime', label: 'Arrival Time', sortable: true },
    { key: 'transportType', label: 'Transport Type', sortable: true },
    { key: 'distanceKm', label: 'Distance (Km)', sortable: true }
]

const loadData = async () => {
    isLoading.value = true
    const response = await getJourneys(currentPage.value, perPage.value)
    items.value = response && response.length ? response : []
    totalRows.value = response ? response.length : 0
    isLoading.value = false
}

watch([currentPage, perPage], loadData)
onMounted(loadData)

const transportTypeLabel = (type) => {
    switch (type) {
        case 1: return 'Car'
        case 2: return 'Bike'
        case 3: return 'Walk'
        default: return 'Other'
    }
}
</script>

<template>
    <div class="journey-table">
        <b-table :items="items" :fields="columns" :busy="isLoading" striped hover responsive class="table-theme">
            <template #cell(startTime)="data">
                {{ new Date(data.value).toLocaleString() }}
            </template>
            <template #cell(arrivalTime)="data">
                {{ new Date(data.value).toLocaleString() }}
            </template>
            <template #cell(transportType)="data">
                {{ transportTypeLabel(data.value) }}
            </template>

            <template #empty>
                <div class="text-center p-3 text-muted">
                    You need to travel more
                </div>
            </template>
        </b-table>

        <div class="d-flex justify-content-between align-items-center mt-3">
            <div class="d-flex align-items-center gap-2">
                <select id="per-page-select" v-model.number="perPage" class="form-select w-auto">
                    <option v-for="opt in perPageOptions" :key="opt" :value="opt">{{ opt }}</option>
                </select>
            </div>

            <b-pagination v-model="currentPage" :total-rows="totalRows" :per-page="perPage" align="right"
                variant="secondary" />
        </div>
    </div>
</template>
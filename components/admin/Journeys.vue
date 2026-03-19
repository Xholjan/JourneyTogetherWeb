<script setup>
import { ref, watch, onMounted } from 'vue'
import { useAdmin } from '../../composables/useAdmin'

const props = defineProps({
    refresh: {
        type: Number,
        default: 0
    }
})

const emit = defineEmits(['select'])
const { getJourneys } = useAdmin()
const { getUsers } = useUsers()
const items = ref([])
const totalRows = ref(0)
const currentPage = ref(1)
const perPage = ref(10)
const isLoading = ref(false)
const perPageOptions = [10, 15, 20]
const users = ref([])

const columns = [
    { key: 'id', label: 'ID', sortable: true },
    { key: 'startLocation', label: 'Start Location', sortable: true },
    { key: 'startTime', label: 'Start Time', sortable: true },
    { key: 'arrivalLocation', label: 'Arrival Location', sortable: true },
    { key: 'arrivalTime', label: 'Arrival Time', sortable: true },
    { key: 'transportType', label: 'Transport Type', sortable: true },
    { key: 'distanceKm', label: 'Distance (Km)', sortable: true }
]

const form = ref({
    id: null,
    transportType: null,
    startDateFrom: null,
    startDateTo: null,
    arrivalDateFrom: null,
    arrivalDateTo: null,
    minDistance: null,
    maxDistance: null,
    page: 1,
    pageSize: 10,
    orderBy: null,
    direction: null
});

const loadData = async () => {
    isLoading.value = true
    const response = await getJourneys(form.value)
    items.value = response ? response.items : []
    totalRows.value = response ? response.totalItems : 0
    isLoading.value = false
}

const loadUsers = async () => {
    isLoading.value = true
    users.value = await getUsers()
    isLoading.value = false
}

watch([currentPage, perPage], loadData)

watch(() => props.refresh, () => {
    currentPage.value = 1
    loadData()
})

onMounted(() => {
    loadData()
    loadUsers()
})

const transportTypeLabel = (type) => {
    switch (type) {
        case 0: return 'Car'
        case 1: return 'Bus'
        case 2: return 'Train'
        case 3: return 'Plane'
        case 4: return 'Bike'
        case 5: return 'Walk'
    }
}

const onRowClicked = (selected) => {
    emit('select', selected.item.id)
}

const applyFilters = () => {
    currentPage.value = 1
    form.value.page = 1
    form.value.pageSize = perPage.value
    loadData()
}

const resetFilters = () => {
    form.value = {
        id: null,
        transportType: null,
        startDateFrom: null,
        startDateTo: null,
        arrivalDateFrom: null,
        arrivalDateTo: null,
        minDistance: null,
        maxDistance: null,
        page: 1,
        pageSize: perPage.value,
        orderBy: null,
        direction: null
    }

    currentPage.value = 1
    loadData()
}
</script>

<template>
    <div class="filters mb-3">
        <div class="row g-3">
            <div class="col-md-2">
                <label class="form-label">User</label>
                <select v-model="form.id" class="form-select">
                    <option :value="null">All Users</option>
                    <option v-for="user in users" :key="user.id" :value="user.id">
                        {{ user.firstName }} {{ user.lastName }}
                    </option>
                </select>
            </div>
            <div class="col-md-2">
                <label class="form-label">Transport Type</label>
                <select v-model="form.transportType" class="form-select">
                    <option :value="null">All</option>
                    <option :value="0">Car</option>
                    <option :value="1">Bus</option>
                    <option :value="2">Train</option>
                    <option :value="3">Plane</option>
                    <option :value="4">Bike</option>
                    <option :value="5">Walk</option>
                </select>
            </div>
            <div class="col-md-2">
                <label class="form-label">Start From</label>
                <input v-model="form.startDateFrom" type="datetime-local" class="form-control" />
            </div>
            <div class="col-md-2">
                <label class="form-label">Start To</label>
                <input v-model="form.startDateTo" type="datetime-local" class="form-control" />
            </div>
            <div class="col-md-2">
                <label class="form-label">Arrival From</label>
                <input v-model="form.arrivalDateFrom" type="datetime-local" class="form-control" />
            </div>
            <div class="col-md-2">
                <label class="form-label">Arrival To</label>
                <input v-model="form.arrivalDateTo" type="datetime-local" class="form-control" />
            </div>
            <div class="col-md-2">
                <label class="form-label">Min Distance (Km)</label>
                <input v-model.number="form.minDistance" type="number" class="form-control" />
            </div>
            <div class="col-md-2">
                <label class="form-label">Max Distance (Km)</label>
                <input v-model.number="form.maxDistance" type="number" class="form-control" />
            </div>
            <div class="col-md-2">
                <label class="form-label">Order By</label>
                <select v-model="form.orderBy" class="form-select">
                    <option :value="null">None</option>
                    <option value="startTime">Start Time</option>
                    <option value="arrivalTime">Arrival Time</option>
                    <option value="distanceKm">Distance</option>
                </select>
            </div>
            <div class="col-md-2">
                <label class="form-label">Direction</label>
                <select v-model="form.direction" class="form-select">
                    <option :value="null">None</option>
                    <option value="asc">Ascending</option>
                    <option value="desc">Descending</option>
                </select>
            </div>
            <div class="col-md-2 d-flex align-items-end">
                <button class="btn-base btn-login w-100" @click="resetFilters">
                    Reset
                </button>
            </div>
            <div class="col-md-2 d-flex align-items-end">
                <button class="btn-base btn-logout w-100" @click="applyFilters">
                    Apply
                </button>
            </div>
        </div>
    </div>
    <div class="journey-table">
        <b-table :items="items" :fields="columns" :busy="isLoading" striped hover responsive class="table-theme"
            @row-clicked="onRowClicked" show-empty>
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
                <h6>You need to travel more</h6>
            </template>
        </b-table>

        <div class="d-flex justify-content-between align-items-center mt-3">
            <div class="d-flex align-items-center gap-2">
                <select id="per-page-select" v-model.number="perPage" class="form-select w-auto">
                    <option v-for="opt in perPageOptions" :key="opt" :value="opt">{{ opt }}</option>
                </select>
            </div>

            <b-pagination v-model="currentPage" :total-rows="totalRows" :per-page="perPage" align="right"
                variant="secondary" limit="2" />
        </div>
    </div>
</template>
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
const { getStatistics } = useAdmin()
const { getUsers } = useUsers()
const items = ref([])
const totalRows = ref(0)
const currentPage = ref(1)
const perPage = ref(10)
const isLoading = ref(false)
const perPageOptions = [10, 15, 20]
const users = ref([])

const columns = [
    { key: 'userId', label: 'User', sortable: true },
    { key: 'year', label: 'Year', sortable: true },
    { key: 'month', label: 'Month', sortable: true },
    { key: 'totalDistanceKm', label: 'Total Distance (Km)', sortable: true },
]

const form = ref({
    page: 1,
    pageSize: 10,
    orderBy: null,
    direction: null
});

const loadData = async () => {
    isLoading.value = true
    const response = await getStatistics(form.value)
    items.value = response ? response.items : []
    totalRows.value = response ? response.totalItems : 0
    isLoading.value = false
}

const loadUsers = async () => {
    isLoading.value = true
    users.value = await getUsers()
    debugger
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
        page: 1,
        pageSize: perPage.value,
        orderBy: null,
        direction: null
    }

    currentPage.value = 1
    loadData()
}

const getUserName = (id) => {
    if (id === 1) return 'Admin'
    const user = users.value.find(u => u.id === id)
    return user ? user.firstName + ' ' + user.lastName : 'Unknown'
}
</script>

<template>
    <div class="journey-table">
        <div class="filters mb-3">
            <div class="row g-3">
                <div class="col-md-3">
                    <label class="form-label">Order By</label>
                    <select v-model="form.orderBy" class="form-select">
                        <option :value="null">None</option>
                        <option value="distancekm">Total Distance (Km)</option>
                        <option value="year">Year</option>
                        <option value="month">Month</option>
                    </select>
                </div>
                <div class="col-md-3">
                    <label class="form-label">Direction</label>
                    <select v-model="form.direction" class="form-select">
                        <option :value="null">None</option>
                        <option value="asc">Ascending</option>
                        <option value="desc">Descending</option>
                    </select>
                </div>
                <div class="col-md-3 d-flex align-items-end">
                    <button class="btn-base btn-login w-100" @click="resetFilters">
                        Reset
                    </button>
                </div>
                <div class="col-md-3 d-flex align-items-end">
                    <button class="btn-base btn-logout w-100" @click="applyFilters">
                        Apply
                    </button>
                </div>
            </div>
        </div>
        <b-table :items="items" :fields="columns" :busy="isLoading" striped hover responsive class="table-theme"
            @row-clicked="onRowClicked" show-empty>
            <template #cell(userId)="data">
                <span>
                    {{ getUserName(data.item.userId) }}
                </span>
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
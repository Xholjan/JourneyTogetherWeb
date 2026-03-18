<script setup>
import { ref, onMounted } from 'vue'
import { useUsers } from '../../composables/useUsers'

const { $toast } = useNuxtApp();
const emit = defineEmits(['close', 'refresh'])
const { getUsers } = useUsers()
const { updateUser } = useAdmin()
const users = ref([])
const isLoading = ref(false)
const shown = ref(true)

const form = ref({
    id: null,
    status: null,
})

const loadUsers = async () => {
    isLoading.value = true
    users.value = await getUsers()
    isLoading.value = false
}

onMounted(loadUsers)

const submit = async () => {
    if (form.value.id === null || form.value.status === null) {
        $toast.warning('Please select a user and a status!')
        return
    }
    isLoading.value = true
    try {
        await updateUser(form.value.id, form.value.status)
        $toast.success('Done!')
        emit('refresh')
        close()
    } finally {
        isLoading.value = false
    }
}

const close = () => {
    form.value.ids = []
    shown.value = false
    emit('close')
}
</script>

<template>
    <Teleport to="body">
        <div v-if="shown" class="modal-wrapper">
            <div class="modal-backdrop fade show"></div>
            <div class="modal fade show" style="display:block">
                <div class="modal-dialog modal-bottom">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Share Journey</h5>
                            <button class="btn-close" @click="close"></button>
                        </div>
                        <div class="modal-body row g-3">
                            <select v-model="form.id" class="form-select">
                                <option :value="null">Choose User</option>
                                <option v-for="user in users" :key="user.id" :value="user.id">
                                    {{ user.firstName }} {{ user.lastName }}
                                </option>
                            </select>

                            <select v-model="form.status" class="form-select">
                                <option :value="null">Choose Status</option>
                                <option :value="0">Active</option>
                                <option :value="1">Suspended</option>
                                <option :value="2">Deactivated</option>
                            </select>
                        </div>
                        <div class="modal-footer">
                            <button class="btn btn-outline-success" @click="submit" :disabled="isLoading">
                                Submit
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </Teleport>
</template>
<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import Multiselect from '@vueform/multiselect'
import '@vueform/multiselect/themes/default.css'
import { useUsers } from '../../composables/useUsers'
import { useJourneys } from '../../composables/useJourneys'

const emit = defineEmits(['close', 'refresh'])
const props = defineProps({
    journeyId: { type: Number, required: true }
})

const { shareJourney } = useJourneys()
const { getUsers } = useUsers()

const users = ref([])
const isLoading = ref(false)
const shown = ref(true)

const form = ref({
    ids: []
})

const userOptions = computed(() =>
    users.value.map(u => ({
        value: u.id,
        label: `${u.firstName} ${u.lastName} (${u.email})`
    }))
)

const loadUsers = async () => {
    if (props.journeyId > 0) {
        isLoading.value = true
        users.value = await getUsers()
        isLoading.value = false
    }
}

onMounted(loadUsers)
watch(() => props.journeyId, loadUsers)

const submit = async () => {
    isLoading.value = true
    try {
        await shareJourney(props.journeyId, form.value)
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
                        <div class="modal-body">
                            <label class="form-label">Select users to share with</label>
                            <Multiselect v-model="form.ids" :options="userOptions" mode="tags" valueProp="value"
                                label="label" :searchable="true" :close-on-select="false"
                                placeholder="Search users..." />
                        </div>
                        <div class="modal-footer">
                            <button class="btn btn-success" @click="submit"
                                :disabled="isLoading || form.ids.length === 0">
                                Submit
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </Teleport>
</template>
<script setup>
import { ref, onMounted } from 'vue';

const { $tt } = useNuxtApp();
const items = ref(null);
const isLoading = ref(false);
const showUpload = ref(false);
const showVerify = ref(false);
const person = ref(null);

const filters = ref({
    verified: null
});

onMounted(async () => {
    await getVerifications();
});

const getVerifications = async () => {
    isLoading.value = true;
    items.value = await useVerifications(filters.value);
    isLoading.value = false;
};

const handleUploadSelect = async (value) => {
    showUpload.value = true;
    person.value = value;
};

const handleVerifySelect = async (value) => {
    showVerify.value = true;
    person.value = value;
};

const submitFilters = async () => {
    await getVerifications();
};

</script>
<template>
    <CommonCard :title="$tt('285')">
        <div class="row g-3">
            <div class="col-12 col-md-6">
                <select v-model="filters.verified" class="form-select">
                    <option :value="null">{{ $tt(44) }}</option>
                    <option :value="true">{{ $tt(351) }}</option>
                    <option :value="false">{{ $tt(394) }}</option>
                </select>
            </div>
            <div class="col-12 col-md-6">
                <button class="btn btn-primary w-100" @click="submitFilters" :disabled="isLoading">
                    {{ $tt(292) }}
                </button>
            </div>
        </div>
    </CommonCard>
    <CommonCard :title="$tt(391)" :loading="isLoading" containerClass="my-3">
        <VerificationsGrid :dataSource="items" @upload-doc="handleUploadSelect" @verify-person="handleVerifySelect" />
    </CommonCard>

    <VerificationsDocsModal v-if="showUpload" @close="showUpload = false" :person="person" />
    <VerificationsVerifyModal v-if="showVerify" @close="showVerify = false" @refresh="submitFilters" :person="person" />
</template>
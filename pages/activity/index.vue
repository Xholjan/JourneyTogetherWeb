<script setup>
import { ref, isRef, onMounted } from 'vue';

const route = useRoute();
const { $tt, $auth } = useNuxtApp();
const user = isRef($auth?.user) ? $auth.user.value : $auth?.user;
const personId = ref(route.query.personId ? Number(route.query.personId) : 0);
const username = ref('');
const items = ref(null);
const isLoading = ref(false);

const filters = ref({
    personId: personId.value,
    dateFrom: null,
    dateTo: null,
});

onMounted(async () => {
    await getUsername();
    await getActivity();
});

watch(() => route.query, async () => {
    if (Object.keys(route.query).length === 0) {
        personId.value = 0;
        filters.value.personId = 0;
        await getUsername();
        await getActivity();
    }
    else {
        await getUsername();
        await getActivity();
    }
}, { deep: true });

const submitFilters = async () => {
    useDateChanger(filters.value.dateFrom, filters.value.dateTo);
    await getActivity();
};

const onDatesChange = ({ from, to }) => {
    filters.value.dateFrom = from;
    filters.value.dateTo = to;
};

const getUsername = async () => {
    if (personId.value == 0)
        username.value = user.Username
    else
        username.value = await useUsername(personId.value);
};

const getActivity = async () => {
    isLoading.value = true;
    items.value = await useActivity(filters.value);
    isLoading.value = false;
};

useHead({
    title: $tt(131) + ' - ' + user.InitData?.CompanyName
});
</script>

<template>
    <div class="container">
        <CommonCard :title="$tt('33')">
            <template #header>
                {{ $tt(285) }} [ {{ username }} ]
            </template>
            <div id="tblSettings" class="row g-3">
                <div class="col-lg-10">
                    <CommonDateRange @update:dates="onDatesChange" />
                </div>
                <div class="col-12 col-lg-2 text-center align-self-end">
                    <button @click="submitFilters" class="btn btn-primary d-block w-100" :disabled="isLoading">
                        {{ $tt("32") }}
                    </button>
                </div>
            </div>
        </CommonCard>

        <CommonCard :title="$tt('211')" :loading="isLoading" containerClass="my-3">
            <ActivityGrid :dataSource="items" />
        </CommonCard>
    </div>
</template>
<script setup>
import { ref, watch, onMounted } from 'vue';
import { startOfMonth, endOfMonth, subDays, subMonths } from 'date-fns';

const { formatGlobalDate } = useFormat();
const storedDateFrom = ref(localStorage.getItem('date-from'));
const storedDateTo = ref(localStorage.getItem('date-to'));

const dateFromPicker = ref(null);
const dateToPicker = ref(null);

const dateFrom = ref(storedDateFrom.value ? new Date(storedDateFrom.value) : new Date());
const dateTo = ref(storedDateTo.value ? new Date(storedDateTo.value) : new Date());

const emit = defineEmits(['update:dates']);

const today = new Date();
const presetDates = ref([
    { label: "193", value: [today, today] },
    { label: "194", value: [subDays(today, 1), subDays(today, 1)] },
    { label: "195", value: [subDays(today, 6), today] },
    { label: "196", value: [subDays(today, 29), today] },
    { label: "197", value: [startOfMonth(today), endOfMonth(today)] },
    { label: "198", value: [startOfMonth(subMonths(today, 1)), endOfMonth(subMonths(today, 1))] },
]);

const applyPreset = (range) => {
    dateFrom.value = range[0];
    dateTo.value = range[1];
    dateFromPicker.value?.closeMenu();
    dateToPicker.value?.closeMenu();
};

const handleDateSelect = (pickerRef) => {
    if (pickerRef && pickerRef.value) {
        setTimeout(() => {
            pickerRef.value.closeMenu();
        }, 10);
    }
};

watch([dateFrom, dateTo], ([newFrom, newTo]) => {
    if (newFrom > newTo) {
        dateTo.value = newFrom;
    }
    if (newFrom.getFullYear() < 2000) {
        dateFrom.value = new Date();
    }
    if (newTo.getFullYear() < 2000) {
        dateTo.value = new Date();
    }

    const nf = formatGlobalDate(newFrom);
    const of = formatGlobalDate(newTo);

    emit('update:dates', {
        from: nf,
        to: of
    });
}, { immediate: true });

onMounted(() => {
    useDateChanger(
        formatGlobalDate(dateFrom.value),
        formatGlobalDate(dateTo.value)
    );

    emit('update:dates', {
        from: formatGlobalDate(dateFrom.value),
        to: formatGlobalDate(dateTo.value),
    });
});
</script>

<template>
    <div class="row g-3">
        <div class="col-6">
            <div class="ltlLabel">
                {{ $tt("184") }}:
            </div>
            <CommonBaseDatePicker v-model="dateFrom" :enableTime="false" ref="dateFromPicker" :clearable="false"
                :maxDate="new Date()" :autoApply="true" @update:model-value="() => handleDateSelect(dateFromPicker)">
                <template #action-extra>
                    <div class="calendar">
                        <div class="preset-grid w-100 p-1">
                            <button v-for="preset in presetDates" :key="preset.label"
                                @click.prevent="applyPreset(preset.value)" class="btn btn-outline-primary btn-sm">
                                {{ $tt(preset.label) }}
                            </button>
                        </div>
                    </div>
                </template>
            </CommonBaseDatePicker>
        </div>

        <div class="col-6">
            <div class="ltlLabel">
                {{ $tt("185") }}:
            </div>
            <CommonBaseDatePicker v-model="dateTo" :enableTime="false" ref="dateToPicker" :clearable="false"
                :minDate="dateFrom" :autoApply="true" @update:model-value="() => handleDateSelect(dateToPicker)">
            </CommonBaseDatePicker>
        </div>
    </div>
</template>
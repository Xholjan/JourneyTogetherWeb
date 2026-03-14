<script setup>
const props = defineProps({
    dataSource: {
        type: Array,
        default: () => []
    }
});

const { formatDate } = useFormat();
const { $tt } = useNuxtApp();

const columns = computed(() => [
    {
        fixed: true,
        allowGrouping: false,
        caption: $tt(107),
        dataField: "CreatedOn",
        dataType: 'date',
        customizeText: e => formatDate(e.value, false),
    },
    {
        caption: $tt(311),
        dataField: "SessionId",
    },
    {
        caption: $tt(310),
        dataField: "IP",
    },
    {
        caption: $tt(309),
        dataField: "Device",
    },
    {
        caption: $tt(313),
        dataField: "Domain",
    },
    {
        caption: $tt(312),
        dataField: "Details",
    }
]);
</script>

<template>
    <CommonGrid :data-source="props.dataSource" :columns="columns" selection-mode="single"
        export-file-name="Activity" />
</template>

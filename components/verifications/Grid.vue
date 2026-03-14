<script setup>

const props = defineProps({
    dataSource: {
        type: Array,
        default: () => []
    }
});

const emit = defineEmits(['upload-doc', 'verify-person']);
const { $tt } = useNuxtApp();
const { formatDate, formatTime } = useFormat();

const columns = computed(() => [
    {
        caption: "#",
        dataField: "no",
        width: 50,
        alignment: "center",
        allowSorting: false,
        allowFiltering: false,
        fixed: true,
        cellTemplate: (container, options) => {
            container.textContent = options.rowIndex + 1;
        },
    },
    {
        caption: $tt(66),
        dataField: "Username",
    },
    {
        caption: $tt(60),
        dataField: "FirstName",
    },
    {
        caption: $tt(62),
        dataField: "LastName",
    },
    {
        caption: $tt(107),
        dataField: "CreatedOn",
        customizeText: (e) => formatDate(e.value) + " " + formatTime(e.value),
    },
    {
        caption: $tt(351),
        dataField: "Verified",
    },
    {
        caption: $tt(393),
        width: 100,
        alignment: "center",
        allowSorting: false,
        allowFiltering: false,
        cellTemplate: (container, options) => {
            container.style.cursor = "pointer";
            container.style.textAlign = "center";

            const icon = document.createElement("i");
            icon.className = "fad fa-upload";
            container.appendChild(icon);

            container.onclick = () => {
                emit('upload-doc', { personId: options.data.PersonId, name: options.data.Username });
            };
        }
    },
    {
        caption: $tt(392),
        width: 100,
        alignment: "center",
        allowSorting: false,
        allowFiltering: false,
        cellTemplate: (container, options) => {
            container.style.cursor = "pointer";
            container.style.textAlign = "center";

            const icon = document.createElement("i");
            icon.className = "fad fa-pen";
            container.appendChild(icon);

            container.onclick = () => {
                emit('verify-person', { personId: options.data.PersonId, name: options.data.Username });
            };
        }
    }
]);

const gridOptions = {
    searchPanel: {
        placeholder: $tt(292) + '...',
        visible: true,
        highlightCaseSensitive: true,
    },
    export: { enabled: false },
};
</script>

<template>
    <CommonGrid :data-source="props.dataSource" :columns="columns" selection-mode="single"
        :grid-options="gridOptions" />
</template>

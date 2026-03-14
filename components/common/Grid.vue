<script setup>

const props = defineProps({
    dataSource: {
        type: Array,
        default: () => []
    },
    columns: {
        type: Array,
        required: true
    },
    summary: {
        type: Object,
        default: () => ({})
    },
    selectionMode: {
        type: String,
        default: 'single',
        validator: (value) => ['single', 'multiple'].includes(value)
    },
    exportFileName: {
        type: String,
        default: 'DataExport'
    },
    onSelectionChanged: {
        type: Function,
        default: () => { }
    },
    gridOptions: {
        type: Object,
        default: () => ({})
    }
});

const { $tt } = useNuxtApp();
const gridContainer = ref(null);
const gridInstance = ref(null);

const gridConfiguration = computed(() => ({
    dataSource: props.dataSource,
    columns: props.columns,
    summary: props.summary,
    height: 'auto',

    export: { enabled: true },
    allowColumnResizing: true,
    columnAutoWidth: true,
    hoverStateEnabled: true,
    allowColumnReordering: false,
    showBorders: true,
    rowAlternationEnabled: true,
    noDataText: $tt(49),
    selection: { mode: props.selectionMode },

    scrolling: {
        mode: 'standard',
        useNative: true,
        scrollByContent: true,
        scrollByThumb: true,
        showScrollbar: 'onHover'
    },

    grouping: {
        contextMenuEnabled: true,
        expandMode: "rowClick"
    },
    groupPanel: {
        emptyPanelText: $tt(286),
        visible: true
    },

    pager: {
        allowedPageSizes: [100, 200, 500, 1000],
        showInfo: false,
        showNavigationButtons: true,
        showPageSizeSelector: true,
        visible: true
    },
    paging: {
        pageSize: 100
    },

    loadPanel: {
        enabled: true,
    },

    onSelectionChanged: props.onSelectionChanged,

    onExporting(e) {
        var workbook = new ExcelJS.Workbook();
        var worksheet = workbook.addWorksheet('Sheet1');
        DevExpress.excelExporter.exportDataGrid({
            worksheet: worksheet,
            component: e.component,
            customizeCell: function (options) {
                var excelCell = options;
                excelCell.font = { name: 'Arial', size: 12 };
                excelCell.alignment = { horizontal: 'left' };
            }
        }).then(function () {
            workbook.xlsx.writeBuffer().then(function (buffer) {
                saveAs(new Blob([buffer], { type: 'application/octet-stream' }), `${props.exportFileName}.xlsx`);
            });
        });
        e.cancel = true;
    },

    ...props.gridOptions
}));

watch(() => props.dataSource, (newData) => {
    if (gridInstance.value) {
        gridInstance.value.beginCustomLoading();
        gridInstance.value.option('dataSource', newData);
        gridInstance.value.endCustomLoading();
    }
}, { immediate: true });

watch(() => props.columns, (newCols) => {
    if (gridInstance.value) {
        gridInstance.value.beginCustomLoading();
        gridInstance.value.option('columns', newCols);
        gridInstance.value.endCustomLoading();
    }
}, { immediate: true });

watch(() => props.summary, (newSummary) => {
    if (gridInstance.value) {
        gridInstance.value.beginCustomLoading();
        gridInstance.value.option('summary', newSummary);
        gridInstance.value.endCustomLoading();
    }
}, { immediate: true });

onMounted(async () => {
    if (typeof DevExpress !== 'undefined') {
        gridInstance.value = new DevExpress.ui.dxDataGrid(gridContainer.value, gridConfiguration.value);
    } else {
        console.error('DevExtreme library not loaded. Please ensure DevExtreme JS/CSS files are correctly included.');
    }
});

onUnmounted(() => {
    if (gridInstance.value) {
        gridInstance.value.dispose();
        gridInstance.value = null;
    }
});

defineExpose({
    gridInstance
});
</script>

<template>
    <div ref="gridContainer"></div>
</template>

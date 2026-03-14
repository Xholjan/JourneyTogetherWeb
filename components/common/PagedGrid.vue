<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';

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
    pagingData: {
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
    onPagingChange: {
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

const serverDataSource = computed(() => {
    return new DevExpress.data.DataSource({
        store: new DevExpress.data.CustomStore({
            load: () => {
                const data = props.dataSource || [];
                const total = props.pagingData?.totalItems ?? data.length ?? 0;

                return Promise.resolve({
                    data,
                    totalCount: total
                });
            }
        }),
        paginate: true
    });
});

const gridConfiguration = computed(() => ({
    dataSource: serverDataSource.value,
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
        enabled: true,
        pageSize: props.pagingData?.pageSize ?? 100,
        pageIndex: (props.pagingData?.pageNumber ?? 1) - 1
    },
    remoteOperations: {
        paging: true
    },

    onSelectionChanged: props.onSelectionChanged,

    onOptionChanged(e) {
        if (e.fullName === 'paging.pageIndex') {
            props.onPagingChange?.({
                pageNumber: e.value + 1,
                pageSize: gridInstance.value.option('paging.pageSize')
            });
        }
        if (e.fullName === 'paging.pageSize') {
            props.onPagingChange?.({
                pageNumber: 1,
                pageSize: e.value
            });
        }
    },

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

watch([() => props.dataSource, () => props.pagingData], () => {
    if (gridInstance.value) {
        gridInstance.value.beginCustomLoading();
        gridInstance.value.option('dataSource', serverDataSource.value);
        gridInstance.value.option('paging.pageIndex', (props.pagingData.pageNumber || 1) - 1);
        gridInstance.value.option('paging.pageSize', props.pagingData.pageSize);
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

onMounted(() => {
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

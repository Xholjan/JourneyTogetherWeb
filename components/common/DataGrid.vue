<script setup>
import { ref, computed, watch } from "vue"

const props = defineProps({
    dataSource: { type: Array },
    pagingData: { type: Object, default: () => ({}) },
    loading: { type: Boolean, default: false },
    filter: { type: Object, default: () => ({}) },
    title: { type: String, default: "" },
    columns: { type: Array, default: null },
    showIndexColumn: { type: Boolean, default: true },
    showActionsColumn: { type: Boolean, default: true },
    pageSize: { type: Number, default: 100 },
    pageSizeOptions: { type: Array, default: () => [100, 200, 500, 1000] },
    selectable: { type: Boolean, default: false },
    selectMode: { type: String, default: "single" },
    emptyText: { type: String, default: "No data found!" },
    filterable: { type: Boolean, default: true },
    searchPlaceholder: { type: String, default: "Search..." },
    customFilter: { type: Function, default: null },
    showPagination: { type: Boolean, default: true },
    primaryKey: { type: String, default: "id" },
    exportName: { type: String, default: "Data" },
})

const emit = defineEmits(["row-click", "selection-change", "page-changed"])

const page = ref(props.pagingData?.pageNumber || 1)
const perPage = ref(props.pagingData?.pageSize || props.pageSize)
const search = ref("")
const sortBy = ref(null)
const sortDir = ref(null)
const selectedRows = ref([])

const sourceRows = computed(() => Array.isArray(props.dataSource) ? props.dataSource : [])

const normalizeColumn = (column) => {
    const key = column?.key || column?.dataField || column?.name
    return { ...column, key, label: column?.label || column?.caption || key }
}

const getColumnsWithIndexAndActions = (columns) => {
    const cols = [...columns]
    if (props.showIndexColumn) cols.unshift({ key: "_index", label: "#", sortable: false })
    if (props.showActionsColumn) cols.push({ key: "_actions", label: "Actions", sortable: false })
    return cols
}

const dgColumns = computed(() => {
    if (props.columns?.length) {
        const normalizedColumns = props.columns.map(normalizeColumn)
        return getColumnsWithIndexAndActions(normalizedColumns)
    }
    if (!sourceRows.value.length) return []
    const cols = Object.keys(sourceRows.value[0]).map(key => ({ key, label: key }))
    return getColumnsWithIndexAndActions(cols)
})

const hasCustomFooter = computed(() => dgColumns.value.some(f => f.footer || f.footerHtml))

const isServerPaging = computed(() => props.pagingData?.totalItems != null)

const totalRows = computed(() => isServerPaging.value ? props.pagingData.totalItems : sourceRows.value.length)

const rows = computed(() => {
    if (isServerPaging.value || !props.showPagination) return sourceRows.value

    const start = (page.value - 1) * perPage.value
    return sourceRows.value.slice(start, start + perPage.value)
})

const clearSelection = () => { selectedRows.value = []; emit("selection-change", []) }

const onRowClick = (item, index, event) => emit("row-click", item, index, event)
const onRowSelected = (selection) => { selectedRows.value = selection; emit("selection-change", selection) }

const onSortChanged = (ctx) => {
    sortBy.value = ctx.sortBy || null
    sortDir.value = ctx.sortBy ? (ctx.sortDesc ? "desc" : "asc") : null
    page.value = 1
    emit("page-changed", { pageNumber: page.value, pageSize: perPage.value, sortBy: sortBy.value, sortDir: sortDir.value })
}

const changePerPage = (size) => {
    if (perPage === size) return
    perPage.value = size
    page.value = 1
    emit("page-changed", {
        pageNumber: page.value,
        pageSize: perPage.value,
        sortBy: sortBy.value,
        sortDir: sortDir.value
    })
}

const exportTable = () => {
    if (!rows.value.length) return;

    const visibleCols = props.columns.filter(
        (c) => c.key !== "_actions" && c.key !== "_index"
    );

    const exportRows = rows.value.map((row) => {
        const obj = {};
        visibleCols.forEach((col) => {
            if (col.calculateCellValue) {
                obj[col.caption] = col.calculateCellValue(row);
            } else if (col.dataField) {
                obj[col.caption] = row[col.dataField] ?? "";
            } else {
                obj[col.caption] = "";
            }
        });
        return obj;
    });

    let tableHtml = "<table><thead><tr>";
    visibleCols.forEach((col) => {
        tableHtml += `<th style="text-align:left;font-family:Arial;font-size:12px;">${col.caption}</th>`;
    });
    tableHtml += "</tr></thead><tbody>";

    exportRows.forEach((row) => {
        tableHtml += "<tr>";
        visibleCols.forEach((col) => {
            let val = row[col.caption] ?? "";
            val = String(val)
                .replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;");
            tableHtml += `<td style="text-align:left;font-family:Arial;font-size:12px;">${val}</td>`;
        });
        tableHtml += "</tr>";
    });

    tableHtml += "</tbody></table>";

    const blob = new Blob([tableHtml], { type: "application/vnd.ms-excel" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${props.exportName}.xlsx`;
    link.click();
};

watch(page, (newPage) => {
    if (isServerPaging.value) {
        emit("page-changed", {
            pageNumber: newPage,
            pageSize: props.pagingData?.PageSize || perPage.value,
            sortBy: sortBy.value,
            sortDir: sortDir.value
        })
    }
})

watch(perPage, () => { page.value = 1 })
watch(search, () => { page.value = 1 })
watch(() => props.dataSource, () => { if (selectedRows.value.length) clearSelection() }, { deep: true })
</script>

<template>
    <div :title="title" class="data-grid">
        <BRow class="justify-content-end mb-2">
            <BCol cols="auto">
                <BButton size="sm" variant=""
                    class="d-flex justify-content-center align-items-center btn-outline-secondary" @click="exportTable">
                    <i class="far fa-file-excel"></i>
                </BButton>
            </BCol>
        </BRow>
        <BRow class="justify-content-between">
            <BCol v-if="filterable">
                <BFormInput type="search" autocomplete="off" class="mb-3" v-model="search"
                    :placeholder="searchPlaceholder" />
            </BCol>
        </BRow>

        <BTable responsive bordered hover show-empty :items="rows" :fields="dgColumns" :busy="loading"
            :empty-text="emptyText" :selectable="selectable" :select-mode="selectMode" :no-local-sorting="true"
            :primary-key="primaryKey" @row-clicked="onRowClick" @row-selected="onRowSelected"
            @sort-changed="onSortChanged">

            <template #table-busy>
                <div class="d-flex justify-content-center align-items-center py-5">
                    <div class="w-50" style="max-width: 320px; min-width: 180px;">
                        <BProgress :value="100" height="6px" striped animated />
                    </div>
                </div>
            </template>

            <template #cell(_index)="row">
                <div>{{ (page - 1) * perPage + (row.index ?? row.rowIndex ?? 0) + 1 }}</div>
            </template>

            <template v-for="(_, slotName) in $slots" #[slotName]="scope">
                <slot :name="slotName" v-bind="scope" />
            </template>

            <template #empty>
                <slot name="empty">
                    <div class="text-center text-muted py-4">{{ emptyText }}</div>
                </slot>
            </template>

            <template v-if="hasCustomFooter" #custom-foot>
                <BTr class="TRFoot">
                    <td v-for="field in dgColumns" :key="field.key" :class="field.footerClass">
                        <b v-if="field.footer">{{ field.footer(sourceRows) }}</b>
                        <div v-else-if="field.footerHtml" v-html="field.footerHtml(sourceRows)" />
                        <b v-else>&nbsp;</b>
                    </td>
                </BTr>
            </template>
        </BTable>

        <BRow v-if="showPagination && totalRows">
            <BCol cols="6" class="d-flex align-items-center">
                <div class="d-flex">
                    <button v-for="size in pageSizeOptions" :key="size" @click="changePerPage(size)"
                        :class="['btn btn-xs me-1', perPage === size ? 'btn-primary' : 'btn-outline-secondary']">
                        {{ size }}
                    </button>
                </div>
            </BCol>

            <BCol cols="6" class="d-flex align-items-center justify-content-end">
                <BPagination v-model="page" :total-rows="totalRows" :per-page="perPage" size="sm" class="m-0" />
            </BCol>
        </BRow>
    </div>
</template>
<template>
    <div class="toast-container position-fixed top-0 start-50 translate-middle-x p-3">
        <transition-group name="toast" tag="div">
            <div v-for="toast in toasts" :key="toast.id" class="toast show border-0 mb-2 bg-body" role="alert"
                aria-live="assertive" aria-atomic="true">
                <div class="d-flex">
                    <div class="toast-body">
                        <i :class="iconClass(toast.variant)"></i>
                        {{ toast.message }}
                    </div>
                    <button class="btn-close btn-close-black me-2 m-auto" style="transform: scale(0.7);"
                        @click="remove(toast.id)" />
                </div>
            </div>
        </transition-group>
    </div>
</template>
<script setup>
import { ref } from 'vue';

const toasts = ref([]);
let id = 0;

function add({ variant, message, delay }) {
    const toast = { id: id++, variant, message };
    toasts.value.push(toast);
    setTimeout(() => remove(toast.id), delay);
}

function remove(id) {
    toasts.value = toasts.value.filter(t => t.id !== id);
}

function iconClass(variant) {
    switch (variant) {
        case 'success':
            return 'fas fa-check-circle text-success';
        case 'danger':
            return 'fas fa-times-circle text-danger';
        case 'warning':
            return 'fas fa-exclamation-triangle text-warning';
        case 'info':
            return 'fas fa-info-circle text-info';
        default:
            return '';
    }
}

defineExpose({ add, remove, iconClass });
</script>

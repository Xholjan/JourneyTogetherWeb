<script setup>
const props = defineProps({
    loading: {
        type: Boolean,
        default: () => false
    },
    containerClass: {
        type: String,
        default: "mt-3"
    },
    headerClass: {
        type: String,
        default: "card-header"
    },
    bodyClass: {
        type: String,
        default: ""
    },
    title: {
        type: String,
        default: ""
    },
    hasHeader: {
        type: Boolean,
        default: true
    }
});
</script>

<template>
    <div class="card" :class="props.containerClass">
        <div class="loaderEl" v-if="props.loading"></div>
        <div v-if="props.hasHeader" :class="props.headerClass">
            <slot name="header">
                {{ props.title }}
            </slot>
        </div>
        <div class="card-body" :class="props.bodyClass">
            <slot>
            </slot>
        </div>
    </div>
</template>
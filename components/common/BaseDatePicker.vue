<script setup>
import { ref, computed } from 'vue';
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import * as locales from 'date-fns/locale';

const props = defineProps({
    modelValue:
    {
        type: Date,
        default: null
    },
    minDate: {
        type: Date,
        default: null
    },
    maxDate: {
        type: Date,
        default: null
    },
    enableTime: {
        type: Boolean,
        default: false
    },
    autoApply: {
        type: Boolean,
        default: true
    },
    clearable: {
        type: Boolean,
        default: false
    },
    position: {
        type: String,
        default: 'left'
    },
    teleport: {
        type: [String, Boolean],
        default: false
    }
});

const emit = defineEmits(['update:modelValue']);

const model = computed({
    get: () => props.modelValue,
    set: (val) => emit('update:modelValue', val)
});

const pickerRef = ref(null);

const { selectedLanguage } = useLanguage();
const { public: { dateFormat, dateTimeFormat } } = useRuntimeConfig();

const currentLocale = computed(() =>
    locales[selectedLanguage.value.FnsCode] ?? locales.enUS
);

const format = computed(() => (props.enableTime ? dateTimeFormat : dateFormat));

const handleChange = (val) => emit('update:modelValue', val);

defineExpose({
    closeMenu: () => {
        pickerRef.value?.closeMenu?.();
    }
});
</script>

<template>
    <VueDatePicker ref="pickerRef" v-model="model" :enable-time-picker="props.enableTime" :format="format"
        :position="props.position" :clearable="props.clearable" :format-locale="currentLocale" :min-date="props.minDate"
        :max-date="props.maxDate" :auto-apply="props.autoApply" :teleport="props.teleport"
        @update:model-value="handleChange">
        <template #action-extra>
            <slot name="action-extra" />
        </template>
    </VueDatePicker>
</template>
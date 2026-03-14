<script setup>
import { ref, onMounted, watch, defineExpose } from 'vue';

const MAX_INTEGER_DIGITS = 15;
const MAX_DECIMAL_DIGITS = 2;

const props = defineProps({
    modelValue: {
        type: Number,
        default: null
    },
    allowDecimal: {
        type: Boolean,
        default: true
    },
    tabindex: {
        type: [String, Number],
        default: null
    }
});

const emit = defineEmits(["update:modelValue"]);
const displayValue = ref("");

const inputRef = ref(null);
const focus = () => { inputRef.value?.focus(); };
defineExpose({ focus });

const formatNumber = (value) => {
    if (value === null || value === "") return "";
    const str = value.toString().replace(/,/g, "");
    const [intPart, decimalPart] = str.split(".");
    const formattedInt = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return props.allowDecimal && decimalPart !== undefined
        ? `${formattedInt}.${decimalPart}`
        : formattedInt;
};

const onInput = (e) => {
    let raw = e.target.value.replace(/,/g, "");
    let isNegative = raw.includes("-");
    raw = raw.replace(/-/g, "");

    if (props.allowDecimal) {
        raw = raw.replace(/[^0-9.]/g, "");

        const parts = raw.split(".");
        let intPart = parts[0].slice(0, MAX_INTEGER_DIGITS);
        let decimalPart = parts[1] || "";

        if (decimalPart.length > MAX_DECIMAL_DIGITS) {
            decimalPart = decimalPart.slice(0, MAX_DECIMAL_DIGITS);
        }

        raw = decimalPart ? intPart + "." + decimalPart : intPart;
    } else {
        raw = raw.replace(/[^0-9]/g, "");
        raw = raw.slice(0, MAX_INTEGER_DIGITS);
    }

    if (isNegative && raw !== "") raw = "-" + raw;

    displayValue.value = raw ? formatNumber(raw) : "";
    emit("update:modelValue", raw ? Number(raw) : null);
};

const onKeyDown = (e) => {
    const allowedKeys = ["Backspace", "Tab", "ArrowLeft", "ArrowRight", "Delete", "Enter", "Home", "End"];
    if (allowedKeys.includes(e.key)) return;

    if (e.key === "-" && e.target.value.includes("-")) {
        e.preventDefault();
    }

    const currentValue = e.target.value.replace(/,/g, "");
    const [intPart, decimalPart] = currentValue.split(".");

    if (intPart.length >= MAX_INTEGER_DIGITS && e.key !== "." && e.key !== "-" && !allowedKeys.includes(e.key)) {
        e.preventDefault();
        return;
    }

    if (
        props.allowDecimal &&
        decimalPart &&
        decimalPart.length >= MAX_DECIMAL_DIGITS &&
        e.target.selectionStart > currentValue.indexOf(".") &&
        e.key !== "Backspace"
    ) {
        e.preventDefault();
    }

    if (props.allowDecimal) {
        if (!/[0-9.]/.test(e.key) && !/[-]/.test((e.key))) {
            e.preventDefault();
        }
        if (e.key === "." && currentValue.includes(".")) {
            e.preventDefault();
        }
    } else {
        if (!/[0-9]/.test(e.key)) {
            e.preventDefault();
        }
    }
};

onMounted(() => {
    if (props.modelValue !== null) displayValue.value = formatNumber(props.modelValue);
});

watch(
    () => props.modelValue,
    (newVal) => {
        displayValue.value = newVal !== null ? formatNumber(newVal) : "";
    }
);
</script>

<template>
    <input ref="inputRef" :value="displayValue" @input="onInput" @keydown="onKeyDown" class="form-control text-end"
        :tabindex="tabindex" />
</template>

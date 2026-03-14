import { ref } from 'vue';

const message = ref(null);

export const useErrorMessage = () => {
    const set = (msg) => {
        message.value = msg;
    };
    const clear = () => {
        message.value = null;
    };
    return { message, set, clear };
};

import { ref } from 'vue';

const useInfoRefresherFlag = ref(false);

export const useInfoRefresher = () => {
    const useInfoRefresherDone = () => {
        useInfoRefresherFlag.value = true;

        setTimeout(() => {
            useInfoRefresherFlag.value = false;
        }, 0);
    }

    return {
        useInfoRefresherFlag,
        useInfoRefresherDone
    };
}

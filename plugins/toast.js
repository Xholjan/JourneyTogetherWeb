import { createApp, h } from 'vue';
import AppToast from '~/components/common/AppToast.vue';

let lastError = Date.now();
let toastApi = null;

export default defineNuxtPlugin(() => {
    if (!toastApi) {
        const el = document.createElement('div');
        document.body.appendChild(el);

        const app = createApp({
            render() {
                return h(AppToast, {
                    ref: 'toastRef',
                });
            },
            mounted() {
                toastApi = this.$refs.toastRef;
            },
        });

        app.mount(el);
    }

    const toast = {
        success(message = {}) {
            emit('success', message, 1500);
        },
        error(message = {}) {
            const now = Date.now();
            if (now - lastError < 100) return;
            lastError = now;

            emit('danger', message, 2000);
        },
        warning(message = {}) {
            emit('warning', message, 2500);
        },
        info(message = {}) {
            emit('info', message, 2500);
        },
    };

    function emit(variant, message, delay) {
        toastApi?.add({
            variant,
            message,
            delay,
        });
    }

    return {
        provide: {
            toast,
        },
    };
});

import { useNuxtApp } from '#app';

export const useActivity = (filters) => {
    const { $axios } = useNuxtApp();

    const payload = useApiPayload(filters, {
        MemberId: filters.personId,
    });
    return $axios.post(`/activity`, payload);
};

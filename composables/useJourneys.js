export const useJourneys = () => {
    const { $axios } = useNuxtApp();
    const getJourneys = async (page = 1, pageSize = 10) => {
        const response = await $axios.get('/api/journeys', {
            params: { page, pageSize }
        });
        return response;
    };
    return { getJourneys };
};
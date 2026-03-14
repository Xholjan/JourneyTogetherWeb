import { useAuth0 } from '@auth0/auth0-vue';

export const useJourneys = () => {
    const { $axios } = useNuxtApp();
    const auth0 = useAuth0();

    const getJourneys = async (page = 1, pageSize = 10) => {

        const token = await auth0.getAccessTokenSilently({
            audience: 'https://api.journeytogether.com'
        });

        const response = await $axios.get('/api/journeys', {
            params: { page, pageSize },
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response;
    };
    return { getJourneys };
};
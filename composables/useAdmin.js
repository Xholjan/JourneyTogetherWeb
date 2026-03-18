import { useAuth0 } from '@auth0/auth0-vue';

export const useAdmin = () => {
    const { $axios } = useNuxtApp();
    const auth0 = useAuth0();

    const getAdmin = async () => {
        const token = await auth0.getAccessTokenSilently({
            audience: 'https://api.journeytogether.com',
            scope: 'openid profile email',
            detailedResponse: true,
        });

        const response = await $axios.get('/api/admin', {
            headers: { Authorization: "Bearer " + token.access_token },
        });
        return response;
    };

    const getJourneys = async (form) => {
        const token = await auth0.getAccessTokenSilently({
            audience: 'https://api.journeytogether.com',
            scope: 'openid profile email',
            detailedResponse: true,
        });

        const response = await $axios.get('/api/admin/journeys', {
            params: {
                id: form.id,
                transportType: form.transportType,
                startDateFrom: form.startTimeForm,
                startDateTo: form.startTimeTo,
                arrivalDateFrom: form.arrivalTimeFrom,
                arrivalDateTo: form.arrivalTimeTo,
                minDistance: form.minDistance,
                maxDistance: form.maxDistance,
                pageSize: form.pageSize,
                page: form.page,
                orderBy: form.orderBy,
                direction: form.direction,
            },
            headers: { Authorization: "Bearer " + token.access_token },
        });
        return response;
    };

    const getStatistics = async (form) => {
        const token = await auth0.getAccessTokenSilently({
            audience: 'https://api.journeytogether.com',
            scope: 'openid profile email',
            detailedResponse: true,
        });

        const response = await $axios.get('/api/admin/statistics/monthly-distance', {
            params: {
                pageSize: form.pageSize,
                page: form.page,
                orderBy: form.orderBy,
                direction: form.direction,
            },
            headers: { Authorization: "Bearer " + token.access_token },
        });
        return response;
    };

    const updateUser = async (userId, status) => {
        const token = await auth0.getAccessTokenSilently({
            audience: 'https://api.journeytogether.com',
            scope: 'openid profile email',
            detailedResponse: true,
        });

        const data = {
            id: userId,
            newStatus: status,
        };

        await $axios.patch(`/api/admin/${userId}/status`, data, {
            headers: { Authorization: "Bearer " + token.access_token },
        });
    };

    return { getAdmin, getJourneys, getStatistics, updateUser };
};
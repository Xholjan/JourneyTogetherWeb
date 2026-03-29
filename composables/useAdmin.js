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
                Id: form.id,
                TransportType: form.transportType,
                StartDateFrom: form.startDateFrom,
                StartDateTo: form.startDateTo,
                ArrivalDateFrom: form.arrivalDateFrom,
                ArrivalDateTo: form.arrivalDateTo,
                MinDistance: form.minDistance,
                MaxDistance: form.maxDistance,
                PageSize: form.pageSize,
                Page: form.page,
                OrderBy: form.orderBy,
                Direction: form.direction,
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
                PageSize: form.pageSize,
                Page: form.page,
                OrderBy: form.orderBy,
                Direction: form.direction,
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
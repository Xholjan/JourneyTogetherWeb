import { useAuth0 } from '@auth0/auth0-vue';

export const useJourneys = () => {
    const { $axios } = useNuxtApp();
    const auth0 = useAuth0();

    const getJourneys = async (page = 1, pageSize = 10) => {
        const token = await auth0.getAccessTokenSilently({
            audience: 'https://api.journeytogether.com',
            scope: 'openid profile email offline_access',
            detailedResponse: true,
        });

        const response = await $axios.get('/api/journeys', {
            params: { page, pageSize },
            headers: { Authorization: "Bearer " + token.access_token },
        });
        return response;
    };

    const getJourneyById = async (id) => {
        const token = await auth0.getAccessTokenSilently({
            audience: 'https://api.journeytogether.com',
            scope: 'openid profile email offline_access',
            detailedResponse: true,
        });

        const response = await $axios.get(`/api/journeys/${id}`, {
            headers: { Authorization: "Bearer " + token.access_token },
        });
        return response;
    };

    const createJourney = async (form) => {
        const token = await auth0.getAccessTokenSilently({
            audience: 'https://api.journeytogether.com',
            scope: 'openid profile email offline_access',
            detailedResponse: true,
        });

        const data = {
            StartLocation: form.startLocation,
            ArrivalLocation: form.arrivalLocation,
            StartTime: form.startTime,
            ArrivalTime: form.arrivalTime,
            TransportType: form.transportType,
            DistanceKm: form.distanceKm,
        };

        const response = await $axios.post('/api/journeys', data, {
            headers: { Authorization: "Bearer " + token.access_token },
        });
        return response;
    };

    const updateJourney = async (journeyId, form) => {
        const token = await auth0.getAccessTokenSilently({
            audience: 'https://api.journeytogether.com',
            scope: 'openid profile email offline_access',
            detailedResponse: true,
        });

        const data = {
            Id: form.id,
            StartLocation: form.startLocation,
            ArrivalLocation: form.arrivalLocation,
            StartTime: form.startTime,
            ArrivalTime: form.arrivalTime,
            TransportType: form.transportType,
            DistanceKm: form.distanceKm,
        };

        const response = await $axios.put(`/api/journeys/${journeyId}`, data, {
            headers: { Authorization: "Bearer " + token.access_token },
        });
        return response;
    };

    const deleteJourney = async (journeyId, form) => {
        const token = await auth0.getAccessTokenSilently({
            audience: 'https://api.journeytogether.com',
            scope: 'openid profile email offline_access',
            detailedResponse: true,
        });

        const response = await $axios.delete(`/api/journeys/${journeyId}`, {
            headers: { Authorization: "Bearer " + token.access_token },
        });
        return response;
    };


    return { getJourneys, getJourneyById, createJourney, updateJourney, deleteJourney };
};
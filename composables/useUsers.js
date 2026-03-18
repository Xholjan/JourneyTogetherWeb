import { useAuth0 } from '@auth0/auth0-vue';

export const useUsers = () => {
    const { $axios } = useNuxtApp();
    const auth0 = useAuth0();

    const getUsers = async (page = 1, pageSize = 10) => {
        const token = await auth0.getAccessTokenSilently({
            audience: 'https://api.journeytogether.com',
            scope: 'openid profile email offline_access',
            detailedResponse: true,
        });

        const response = await $axios.get('/api/users', {
            params: { page, pageSize },
            headers: { Authorization: "Bearer " + token.access_token },
        });
        return response;
    };

    const syncUser = async () => {
        const token = await auth0.getAccessTokenSilently({
            audience: 'https://api.journeytogether.com',
            scope: 'openid profile email offline_access',
            detailedResponse: true,
        });

        const response = await $axios.post('/api/users/sync', null, {
            headers: { Authorization: "Bearer " + token.access_token },
        });
        return response;
    };

    return { getUsers, syncUser };
};
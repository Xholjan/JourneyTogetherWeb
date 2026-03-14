import { useAuth0 } from '@auth0/auth0-vue';
import { useNuxtApp } from '#app';

export const useApi = () => {
    const { $axios } = useNuxtApp();
    const auth0 = useAuth0();

    const get = async (url, config = {}) => {
        const headers = { ...(config.headers || {}) };

        if (auth0 && auth0.getAccessTokenSilently) {
            try {
                const token = await auth0.getAccessTokenSilently({
                    audience: 'https://api.journeytogether.com'
                });
                headers.Authorization = `Bearer ${token}`;
            } catch (err) {
                console.error('Failed to get access token:', err);
            }
        }

        return $axios.get(url, { ...config, headers });
    };

    const post = async (url, data, config = {}) => {
        const headers = { ...(config.headers || {}) };

        if (auth0 && auth0.getAccessTokenSilently) {
            try {
                const token = await auth0.getAccessTokenSilently({
                    audience: 'https://api.journeytogether.com'
                });
                headers.Authorization = `Bearer ${token}`;
            } catch (err) {
                console.error('Failed to get access token:', err);
            }
        }

        return $axios.post(url, data, { ...config, headers });
    };

    return { get, post };
};
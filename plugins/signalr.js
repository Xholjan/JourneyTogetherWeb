import * as signalR from "@microsoft/signalr";
import { useAuth0 } from '@auth0/auth0-vue';

export default defineNuxtPlugin((nuxtApp) => {
    const { getAccessTokenSilently, isAuthenticated } = useAuth0();

    const connection = new signalR.HubConnectionBuilder()
        .withUrl("http://localhost:5000/notifications", {
            accessTokenFactory: async () => {
                if (isAuthenticated.valueOf()) {
                    const token = await getAccessTokenSilently({
                        audience: 'https://api.journeytogether.com',
                        scope: 'openid profile email offline_access',
                        detailedResponse: true,
                    });

                    return token.access_token;
                }
                return null;
            },
        })
        .withAutomaticReconnect()
        .build();

    connection.start();

    connection.on("DailyGoalAchieved", (data) => {
        nuxtApp.$toast.success("Daily goal achieved!");
    });

    nuxtApp.provide("signalr", connection);
});
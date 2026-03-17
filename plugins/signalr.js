import * as signalR from "@microsoft/signalr";
import { useAuth0 } from "@auth0/auth0-vue";

export default defineNuxtPlugin((nuxtApp) => {

    const { getAccessTokenSilently, isAuthenticated } = useAuth0();

    const connection = new signalR.HubConnectionBuilder()
        .withUrl("http://localhost:5000/notifications", {
            accessTokenFactory: async () => {

                if (!isAuthenticated.value) return null;

                const token = await getAccessTokenSilently({
                    authorizationParams: {
                        audience: "https://api.journeytogether.com",
                        scope: "openid profile email offline_access"
                    }
                });

                return token;
            }
        })
        .withAutomaticReconnect()
        .configureLogging(signalR.LogLevel.Error)
        .build();

    const start = async () => {

        if (connection.state === "Connected") return;

        try {
            await connection.start();
            console.log("SignalR connected");
        } catch (err) {
            console.error("SignalR connection error:", err);
        }
    };

    connection.on("DailyGoalAchieved", () => {
        nuxtApp.$toast.success("Daily goal achieved!");
    });

    connection.on("JourneyUpdated", (data) => {
        nuxtApp.$toast.success(data.message);
    });

    nuxtApp.provide("signalr", {
        connection,
        start
    });
});
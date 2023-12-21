import Cookies from "js-cookie";

export default defineNuxtRouteMiddleware(() => {
    if (process.client) {
        const auth = useAuth();
        const token = Cookies.get('authToken');
        auth.value.isAuthenticated = !!token;

        console.log("Auth token is boolean:", auth.value.isAuthenticated);
        console.log("Token:", token);

        return auth.value.isAuthenticated;

    }

});
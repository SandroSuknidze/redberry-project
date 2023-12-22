import Cookies from "js-cookie";

export default defineNuxtRouteMiddleware(() => {
    const auth = useAuth();

    const token = Cookies.get('authToken');
    auth.value.isAuthenticated = !!token;

    if (!auth.value.isAuthenticated) {
        return navigateTo('/');
    }
    return true;

});
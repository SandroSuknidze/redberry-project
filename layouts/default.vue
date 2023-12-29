<script setup>
import Cookies from "js-cookie";


const auth = useAuth();

onMounted(() => {
  const token = Cookies.get('authToken');
  auth.value.isAuthenticated = !!token;
});
</script>

<template>
    <app-header />
    <slot />
</template>

<style scoped>

</style>

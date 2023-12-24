<script setup>
import Cookies from "js-cookie";

const auth = useAuth();

onMounted(() => {
  const token = Cookies.get('authToken');
  auth.value.isAuthenticated = !!token;
});
</script>

<template>
  <div>
    <app-header />
    <slot />
  </div>
</template>

<style scoped>

</style>

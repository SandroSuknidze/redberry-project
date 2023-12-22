<script setup>
const auth = useAuth();

onMounted(() => {
  const token = useCookie('authToken').value; // or localStorage
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

<script setup>

</script>

<template>
  <div>
    <div class="nav">
      <img src="../assets/img/img.png" alt="logo" class="logo">
    </div>
    <div>
      <NuxtLink to="/">Back</NuxtLink>
    </div>
  </div>

</template>

<style scoped>
.nav {
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: 80px;
  background: white;
  border-bottom: 1px solid #E4E3EB;
  padding: 0 76px;
}

.logo {
  width: 150px;
  height: 24px;
}

</style>
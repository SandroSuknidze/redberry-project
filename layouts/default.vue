<script setup>
</script>

<template>
  <div class="nav">
    <img src="public/img.png" alt="logo" class="logo">
    <button class="login">შესვლა</button>
  </div>
  <slot />
</template>

<style scoped>
.nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 80px;
  background: white;
  border: 1px solid #E4E3EB;
  padding: 0 76px;
}

.logo {
  width: 150px;
  height: 24px;
}

.login {
  border-radius: 8px;
  padding: 10px 20px;
  background: #5D37F3;
  color: white;
  cursor: pointer;
}
</style>

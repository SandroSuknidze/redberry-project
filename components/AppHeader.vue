<script setup>
import { ref } from 'vue';

const showLoginForm = ref(false);

const toggleLoginForm = () => {
  showLoginForm.value = true;
};

const closeLoginForm = () => {
  showLoginForm.value = false;
};

const auth = useAuth();

// console.log(auth.value.isAuthenticated);
</script>

<template>
  <div>
    <div class="nav">
      <img src="../assets/img/img.png" alt="logo" class="logo">
      <div v-if="!auth.isAuthenticated" @click="toggleLoginForm" class="login">შესვლა</div>
      <NuxtLink v-else to="/create-blog" class="add-blog">დაამატე ბლოგი</NuxtLink>
    </div>
    <div v-if="showLoginForm">
      <login-form @close="closeLoginForm" />
    </div>
  </div>

</template>

<style scoped>
  .nav {
    display: flex;
    justify-content: space-between;
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

  .login {
    border-radius: 8px;
    padding: 10px 20px;
    background: #5D37F3;
    color: white;
    cursor: pointer;
  }

  .add-blog {
    border-radius: 8px;
    padding: 10px 20px;
    background: #5D37F3;
    color: white;
    cursor: pointer;
    text-decoration: none;
  }
</style>
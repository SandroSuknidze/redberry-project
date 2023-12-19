<script setup lang="ts">
import { ref } from 'vue';

const email = ref('');
const isValidEmail = ref(true);
const isVisible = ref(true);
const isLoginSuccess = ref(false);
const auth = useAuth();


const runtimeConfig = useRuntimeConfig()

const validateEmail = () => {
  const isNotEmpty = email.value.trim() !== '';

  const isValidFormat = email.value.endsWith('@redberry.ge');


  if (isValidFormat && isNotEmpty) {
    isValidEmail.value = true;
    login();
  } else {
    isValidEmail.value = false;

  }
}


const generateToken = async () => {
  try {
    const response = await fetch(`${runtimeConfig.public.apiBase}/token`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const token = await response.text();

      document.cookie = `token=${token}; Secure; HttpOnly; SameSite=Strict`;
      console.log('Token generated successfully!');
      console.log('Token:', token);
      isLoginSuccess.value = true;
    } else {
      throw new Error(`Request failed with status ${response.status}`);
    }
  } catch (error) {
    console.error('Error generating token:', error);
  }
};

const login = async () => {
  if (!isValidEmail.value) {
    return; // Do not proceed if the email is not valid
  }

  try {
    const response = await fetch(`${runtimeConfig.public.apiBase}/login`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email.value,
      }),
    });

    if (response.ok) {
      await generateToken();
      auth.value.isAuthenticated = true;

    } else {
      throw new Error(`Request failed with status ${response.status}`);
    }
  } catch (error) {
    console.log('error sending request', error);
  }
};

</script>
<!--Example@redberry.ge-->
<template>
  <div v-if="isVisible" class="login-form-modal">
    <div v-if="!isLoginSuccess" class="login-form">
      <div class="heading">შესვლა</div>
<!--      <div @click="$emit('close')" class="close"></div>-->
      <img src="../assets/img/img_3.png" @click="$emit('close')" class="close-login">
      <label for="email" class="label-email">ელ-ფოსტა</label>
      <input v-model="email" type="email" class="input-email" required/>
      <div @click="validateEmail" class="login-button">შესვლა</div>
      <div v-if="!isValidEmail" style="color: black">Invalid email</div>
    </div>
    <div v-else class="login-form">
      <img src="../assets/img/img_2.png" alt="success" class="success">
      <div @click="" class="login-button">კარგი</div>
<!--      <div @click="$emit('close')" class="close"></div>-->
      <img src="../assets/img/img_3.png" @click="$emit('close')" class="close-login">


    </div>
  </div>
</template>

<style scoped>
.login-form-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}

.login-form {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  text-align: center;
  width: 480px;
  height: 272px;
  position: relative;
}



.heading {
  font-size: 24px;
  line-height: 32px;
  color: #1A1A1F;
  text-align: center;
  font-weight: 700;
  margin-top: 20px;
}

.input-email {
  width: 100%;
  border: 2px solid #5D37F3;
  background: #F7F7FF;
  height: 44px;
  border-radius: 12px;
  position: relative;
  top: 54px;
}

.login-button {
  cursor: pointer;
  width: 100%;
  color: white;
  background: #5D37F3;
  border-radius: 8px;
  padding: 10px 0;
  font-size: 14px;
  line-height: 20px;
  font-weight: 500;
  margin-top: 80px;
}

.success {
  width: 64px;
  height: 64px;
}

.close-login {
  width: 24px;
  height: 24px;
  position: absolute;
  right: 20px;
  top: 20px;
  cursor: pointer;
}

.label-email {
  color: #1A1A1F;
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
  position: absolute;
}
</style>
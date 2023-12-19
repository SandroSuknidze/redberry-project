<script setup lang="ts">
import { ref } from 'vue';

const email = ref('');
const isValidEmail = ref(true);
const isVisible = ref(true);
const isLoginSuccess = ref(false);


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

      // Store the token securely (e.g., in a cookie or local storage)
      // For example, using cookies:
      document.cookie = `token=${token}; Secure; HttpOnly; SameSite=Strict`;

      console.log('Token generated successfully!');
      console.log('Token:', token);
      isLoginSuccess.value = true;

      // Redirect or update UI as needed
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


      console.log('User logged in successfully!');

      // Redirect or update UI as needed
    } else {
      throw new Error(`Request failed with status ${response.status}`);
    }
  } catch (error) {
    console.log('error sending request', error);
  }
};

</script>

<template>
  <div v-if="isVisible" class="login-form-modal">
    <div v-if="!isLoginSuccess" class="login-form">
      <div class="heading">შესვლა</div>
      <div @click="$emit('close')" class="close"></div>
      <label for="email">ელ-ფოსტა</label>
      <input v-model="email" type="email" placeholder="Example@redberry.ge" class="input" required/>
      <div @click="validateEmail" class="login-button">Login</div>
      <div v-if="!isValidEmail" style="color: black">Invalid email</div>
    </div>
    <div v-else class="login-form">
      <img src="../assets/img/img_2.png">
      <div @click="" class="login-button">კარგი</div>
      <div @click="$emit('close')" class="close"></div>

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


.close {
  position: absolute;
  right: 32px;
  top: 32px;
  width: 24px;
  height: 24px;
  cursor: pointer;
  color: #1A1A1F;
}
.close:before, .close:after {
  position: absolute;
  left: 15px;
  content: ' ';
  height: 18px;
  width: 1.5px;
  background-color: #333;
}
.close:before {
  transform: rotate(45deg);
}
.close:after {
  transform: rotate(-45deg);
}

.heading {
  font-size: 24px;
  line-height: 32px;
  text-align: center;
  font-weight: 700;
}

.input {
  width: 100%;
  border: 1.5px solid #5D37F3;
  background: #F7F7FF;
  height: 44px;
  border-radius: 12px;
  padding-left: 10px;
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
</style>
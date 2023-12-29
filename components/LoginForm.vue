<script setup>
import { ref } from 'vue';
import Cookies from 'js-cookie';

const email = ref('');
const isValidEmail = ref('');
const isValidEmailFormat = ref('');
const isVisible = ref(true);
const isLoginSuccess = ref(false);
const isSubmitValid = ref(false);
const auth = useAuth();


const runtimeConfig = useRuntimeConfig()

const validateEmail = () => {
  const isNotEmpty = email.value.trim() !== '';
  const emailRegex = /^[^\s@]+@redberry\.ge$/;
  const isValidFormat = emailRegex.test(email.value);

  if(!isValidFormat) {
    isValidEmailFormat.value = 'invalid';
    isSubmitValid.value = false;
  }
  else if(!isNotEmpty) {
    isValidEmail.value = 'invalid';
    isSubmitValid.value = false;

  } else {
      isValidEmailFormat.value = 'valid';
      isValidEmail.value = 'valid';
      isSubmitValid.value = true;
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
      const responseText = await response.text();
      const responseData = JSON.parse(responseText);
      const token = responseData.token;


      Cookies.set('authToken', token, { expires: 7, secure: true });
      console.log('Token generated successfully!');
      isLoginSuccess.value = true;
    } else {
      throw new Error(`Request failed with status ${response.status}`);
    }
  } catch (error) {
    console.error('Error generating token:', error);
  }
};

const login = async () => {
  if (isValidEmail.value === 'invalid') {
    return;
  }

  isSubmitValid.value = false;

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
      isValidEmail.value = 'invalid';
      isSubmitValid.value = false;
      throw new Error(`Request failed with status ${response.status}`);
    }
  } catch (error) {
    console.log('error sending request', error);
  }
};

</script>

<template>
  <div v-if="isVisible" class="login-form-modal">
    <div v-if="!isLoginSuccess" class="login-form" :class="{ 'login-form-big': isValidEmail === 'invalid' || isValidEmailFormat === 'invalid' }">
      <div class="heading">შესვლა</div>
      <img src="../assets/img/add.svg" @click="$emit('close')" class="close-login" alt="close-button">
      <div class="label-email">ელ-ფოსტა</div>
      <input v-model="email" @keyup="validateEmail" type="email" class="input-email" :class="{ 'input-email-red': isValidEmail === 'invalid' || isValidEmailFormat === 'invalid'}" placeholder="&#x200A;Example@redberry.ge" required/>

      <div v-if="isValidEmailFormat === 'invalid'" class="error-message">
        <img src="../assets/img/info-circle.svg" alt="error-image">
        <div class="invalid-email">არასწორი ელ-ფოსტის ფორმატი</div>
      </div>
      <div v-else-if="isValidEmail === 'invalid'" class="error-message">
        <img src="../assets/img/info-circle.svg" alt="error-image">
        <div class="invalid-email">ელ-ფოსტა არ მოიძებნა</div>
      </div>
      <div v-if="isSubmitValid" @click="login" class="login-button">შესვლა</div>
      <div v-else class="login-button-invalid">შესვლა</div>
    </div>
    <div v-else class="login-form login-form-big">
      <img src="../assets/img/tick-circle.svg" alt="success" class="success">
      <div class="success-text">წარმატებული ავტორიზაცია</div>
      <NuxtLink to="/">
        <div @click="$emit('close')" class="success-login-button">კარგი</div>
      </NuxtLink>
      <NuxtLink to="/">
        <img src="../assets/img/add.svg" @click="$emit('close')" class="close-login" alt="close-button">
      </NuxtLink>
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
  padding: 0 24px;
  border-radius: 12px;
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
  margin-top: 40px;
  font-family: 'FiraGO Bold 700', sans-serif;

}

.input-email {
  width: 93%;
  border: 1px solid #5D37F3;
  box-shadow: 0 0 0 0.5px #5D37F3;
  background: #F7F7FF;
  height: 44px;
  border-radius: 12px;
  margin-top: 8px;
  padding: 0 15px;
  font-size: 14px;
  font-family: 'FiraGO Regular 400', sans-serif;
  caret-color: #1A1A1F;
  z-index: 2;
}

.input-email:focus {
  border-color: #5D37F3;
  outline: none;
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
  margin-top: 24px;
}

.login-button-invalid {
  width: 100%;
  color: white;
  background: #E4E3EB;
  border-radius: 8px;
  padding: 10px 0;
  font-size: 14px;
  line-height: 20px;
  margin-top: 24px;
}



.success {
  width: 64px;
  height: 64px;
  margin-top: 64px;
}

.success-text {
  color: #1A1A1F;
  margin-top: 16px;
  font-family: 'FiraGO Bold 700', sans-serif;
  line-height: 28px;
  font-size: 20px;
}

.success-login-button {
  cursor: pointer;
  width: 100%;
  color: white;
  background: #5D37F3;
  border-radius: 8px;
  padding: 10px 0;
  font-size: 14px;
  line-height: 20px;
  margin-top: 48px;
  font-family: 'FiraGO Medium 500', sans-serif;
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
  margin-top: 24px;
  text-align: left;
  font-family: 'FiraGO Medium 500', sans-serif;
}

/* Error message */

.invalid-email {
  color: #EA1919;
  line-height: 20px;
  font-family: 'FiraGO Regular 400', sans-serif;
  font-size: 12px;
  margin-left: 8px;
}

.error-message {
  display: flex;
  margin-top: 8px;
}

.input-email-red {
  border: 1px solid #EA1919 !important;
  box-shadow: 0 0 0 0.5px #EA1919 !important;
  background: #FAF2F3;
}

.login-form-big {
  height: 300px !important;
}

/* Error message */


</style>
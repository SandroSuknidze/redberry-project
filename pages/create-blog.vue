<script setup>
  import axios from "axios";
  import defaultArrow from '~/assets/img/Arrow.svg';
  import hoveredArrow from '~/assets/img/Arrow-hover.svg';
  import activeArrow from '~/assets/img/Arrow-active.svg';


  definePageMeta({
    layout: 'custom',
    middleware: ['auth'],
  })

  const runtimeConfig = useRuntimeConfig();
  const token = '2ee1d522f9401a177a2f3e1a6f9fb8e992e9a2151c22d9186ec7794590751cd3';

  const state = ref('');

  const fileUploaded = ref(false);
  const uploadedFileName = ref('');
  const errorMessage = ref('');


  const authorInputText = ref('');
  const isMinLength = ref('');
  const isMinWords = ref('');
  const isGeorgian = ref('');
  const isValid = ref('');

  const titleInputText = ref('');
  const titleIsMinLength = ref('');

  const descriptionInputText = ref('');
  const descriptionIsMinLength = ref('');

  const dateInputText = ref('');
  const dateIsValid = ref('');

  const tags = ref([]);
  const dropdownVisible = ref(false);
  const tagIsValid = ref('');

  const emailInputText = ref('');
  const emailIsValid = ref('');

  const submitIsValid = ref('');

  const submitSuccess = ref(false);

  const authorValidateInput = () => {
    const trimmedInput = authorInputText.value.trim();
    isMinLength.value = trimmedInput.length >= 4 ? 'valid' : 'invalid';

    const words = trimmedInput.split(/\s+/);
    isMinWords.value = words.length >= 2 ? 'valid' : 'invalid';

    const georgianRegex = /^[ა-ჰ]+$/;
    isGeorgian.value = words.every(word => georgianRegex.test(word)) ? 'valid' : 'invalid';

    isValid.value = (isMinLength.value === 'valid' && isMinWords.value === 'valid' && isGeorgian.value === 'valid') ? 'valid' : 'invalid';

    localStorage.setItem('author', authorInputText.value);


    submitValidation();

  }

  const titleValidateInput = () => {
    const trimmedInput = titleInputText.value.trim();
    titleIsMinLength.value = trimmedInput.length >= 2 ? 'valid' : 'invalid';

    localStorage.setItem('title', titleInputText.value);
    submitValidation();

  }

  const descriptionValidateInput = () => {
    const trimmedInput = descriptionInputText.value.trim();
    descriptionIsMinLength.value = trimmedInput.length >= 2 ? 'valid' : 'invalid';

    localStorage.setItem('description', descriptionInputText.value);
    submitValidation();

  }

  const dateValidateInput = () => {
    if (dateInputText.value === '') {
      dateIsValid.value = 'invalid';
    } else {
      dateIsValid.value = 'valid';
    }

    localStorage.setItem('date', dateInputText.value);

    submitValidation();

  }

  const addTag = (option) => {
    if(!tags.value.includes(option)) {
      tags.value.push(option);
    }

    if (tags.value.length > 0) {
      tagIsValid.value = 'valid'
    }

    localStorage.setItem('tags', JSON.stringify(tags.value));
    submitValidation();

  };

  const removeTag = (index) => {
    tags.value.splice(index, 1);
    if (tags.value.length === 0) {
      tagIsValid.value = 'invalid'
    }

    localStorage.setItem('tags', JSON.stringify(tags.value));
    submitValidation();

  };

  const toggleDropdown = () => {
    dropdownVisible.value = !dropdownVisible.value;
  };

  const emailValidateInput = () => {
    const emailRegex = /^[^\s@]+@redberry\.ge$/;
    emailIsValid.value = emailRegex.test(emailInputText.value) ? 'valid' : 'invalid';

    localStorage.setItem('email', emailInputText.value);
    submitValidation();

  }


  function getBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }

  const handleFileUpload = async (event) => {
    const files = event.target.files;
    if (!files.length) {
      errorMessage.value = 'აირჩიეთ ფოტო';
      return;
    }

    const fileCheck = files[0];
    if (!fileCheck.type.startsWith('image/')) {
      errorMessage.value = 'არასწორი ფოტოს ტიპი';
      return;
    }

    errorMessage.value = '';


    const file = event.target.files[0];
    if (file) {
      const base64 = await getBase64(file);
      uploadedFileName.value = file.name;
      fileUploaded.value = true;

      localStorage.setItem('uploadedFile', base64);
      localStorage.setItem('uploadedFileName', file.name);
    }
    submitValidation();
  }

  const checkUploadedFile = () => {
    const fileData = localStorage.getItem('uploadedFile');
    const fileDataName = localStorage.getItem('uploadedFileName');
    if (fileData) {
      uploadedFileName.value = fileDataName;
      fileUploaded.value = true;
    }

    submitValidation();
  }


  function base64ToBlob(base64, mimeType) {
    const byteString = atob(base64.split(',')[1]);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const int8Array = new Uint8Array(arrayBuffer);

    for (let i = 0; i < byteString.length; i++) {
      int8Array[i] = byteString.charCodeAt(i);
    }

    return new Blob([int8Array], { type: mimeType });
  }

  const removeFile = () => {
    fileUploaded.value = false;
    uploadedFileName.value = '';
    localStorage.removeItem('uploadedFile');
    localStorage.removeItem('uploadedFileName');
    submitValidation();
  };

  const triggerFileInput = () => {
    document.getElementById('file-upload').click();
  };

  const handleDrop = (event) => {
    event.preventDefault();

    const files = event.dataTransfer.files;
    if (!files.length) {
      errorMessage.value = 'აირჩიეთ ფოტო';
      return;
    }

    const file = files[0];
    if (!file.type.startsWith('image/')) {
      errorMessage.value = 'არასწორი ფოტოს ტიპი';
      return;
    }

    processFile(file);
  };

  const processFile = async (file) => {
    uploadedFileName.value = file.name;
    fileUploaded.value = true;

    const base64 = await getBase64(file);
    localStorage.setItem('uploadedFile', base64);
    localStorage.setItem('uploadedFileName', file.name);

    submitValidation();
  };
  onMounted(checkUploadedFile);
  onMounted(() => {
    submitValidation();
    document.body.style.backgroundColor = '#FBFAFF';

    const storedAuthor = localStorage.getItem('author');
    if (storedAuthor) {
      authorInputText.value = storedAuthor;
      authorValidateInput();
    }


    const storedTitle = localStorage.getItem('title');
    if (storedTitle) {
      titleInputText.value = storedTitle;
      titleValidateInput();

    }

    const storedDescription = localStorage.getItem('description');
    if (storedDescription) {
      descriptionInputText.value = storedDescription;
      descriptionValidateInput();
    }

    const storedDate = localStorage.getItem('date');
    if (storedDate) {
      dateInputText.value = storedDate;
      dateValidateInput();
    }

    const storedTags = localStorage.getItem('tags');
    if (storedTags) {
      tags.value = JSON.parse(storedTags);
      if (tags.value.length > 0) {
        tagIsValid.value = 'valid'
      }
    }

    const storedEmail = localStorage.getItem('email');
    if (storedEmail) {
      emailInputText.value = storedEmail;
      emailValidateInput();
    }

    submitValidation();
  });

  onUnmounted(() => {
    document.body.style.backgroundColor = '';
  });

  const categories = ref([]);
  const fetchCategories = async () => {
    try {
      const response = await fetch(`${runtimeConfig.public.apiBase}/categories`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        }
      });
      if (response.ok) {
        categories.value = await response.json();
      } else {
        console.error('Error fetching categories:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  onMounted(fetchCategories);


  const submitValidation = () => {
    if (fileUploaded.value === true &&
        ((isValid.value === 'valid' && titleIsMinLength.value === 'valid') &&
            (descriptionIsMinLength.value === 'valid' && dateIsValid.value === 'valid')  && (tagIsValid.value === 'valid')
              && (emailIsValid.value === 'valid' || emailInputText.value.trim() === ''))){
      submitIsValid.value = 'valid';
    } else {
      submitIsValid.value = 'invalid';
    }
  }






  const submitData = async () => {
    if (submitIsValid.value !== 'valid') {
      return;
    }

    const url = `${runtimeConfig.public.apiBase}/blogs`;
    const formData = new FormData();

    formData.append('title', titleInputText.value);
    formData.append('description', descriptionInputText.value);
    formData.append('author', authorInputText.value);
    formData.append('publish_date', dateInputText.value);
    formData.append('email', emailIsValid.value === 'valid' ? emailInputText.value : '');

    const categoryIds = tags.value.map(tag => tag.id);
    formData.append('categories', JSON.stringify(categoryIds));

    if (fileUploaded.value) {
      const base64Image = localStorage.getItem('uploadedFile');
      const mimeType = base64Image.match(/data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,.*/)[1];
      const imageBlob = base64ToBlob(base64Image, mimeType);
      formData.append('image', imageBlob, uploadedFileName.value);
    }

    try {
      const response = await axios.post(url, formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': "application/json",
          'Content-Type': 'multipart/form-data'
        },
      });
      submitSuccess.value = true;
      localStorage.clear();
      console.log('Data submitted successfully:', response.data);

    } catch (error) {
      console.error('Error submitting data:', error);
    }
  };

  const getImageSource = computed(() => {
    switch (state.value) {
      case 'hover':
        return hoveredArrow;
      case 'active':
        return activeArrow;
      default:
        return defaultArrow;
    }
  });



</script>

<template>
  <div>
    <div class="header-container">
      <NuxtLink to="/">
        <img :src="getImageSource"
             @mouseover="state = 'hover'"
             @mouseleave="state = 'normal'"
             @mousedown="state = 'active'"
             alt="arrow" class="arrow">
      </NuxtLink>
      <div class="head-text">ბლოგის დამატება</div>
    </div>
    <div class="form-container">
      <div class="img-label">
        ატვირთეთ ფოტო
      </div>
      <div class="upload-container">
        <div v-if="!fileUploaded" class="file-not-uploaded" @click="triggerFileInput"
             @dragover.prevent
             @drop.prevent="handleDrop">
          <input type="file" id="file-upload" @change="handleFileUpload" @cancel="handleFileUpload" hidden/>
          <img src="../assets/img/folder-add.svg" alt="photo-placeholder" class="upload-icon"/>
          <div class="inside-text">ჩააგდეთ ფაილი აქ ან <span class="inside-text-span">აირჩიეთ ფაილი</span></div>
        </div>
        <div v-else class="uploaded-file-photo">
          <img src="../assets/img/gallery.svg" alt="uploaded-photo-placeholder"
               class="uploaded-icon"> {{ uploadedFileName }}
          <img src="../assets/img/add.svg" alt="close-button" @click="removeFile" class="close-button">
        </div>
        <div v-if="errorMessage !== ''" class="error-image">
          {{ errorMessage }}
        </div>
      </div>
      <div class="author-container">
        <div>
          <div class="author-label">ავტორი *</div>
          <input v-model="authorInputText" @keyup="authorValidateInput"
                 :class="{ 'invalid-input': isValid === 'invalid', 'valid-input': isValid === 'valid' }" type="text"
                 class="author-input" placeholder="&#x200A;შეიყვანეთ ავტორი">
          <ul class="author-validations">
            <li :class="{ 'red': isMinLength === 'invalid', 'green': isMinLength === 'valid'}">მინიმუმ 4 სიმბოლო</li>
            <li :class="{ 'red': isMinWords === 'invalid' , 'green': isMinWords === 'valid'}">მინიმუმ ორი სიტყვა</li>
            <li :class="{ 'red': isGeorgian === 'invalid' , 'green': isGeorgian === 'valid'}">მხოლოდ ქართული
              სიმბოლოები
            </li>
          </ul>
        </div>
        <div>
          <div class="author-label">სათაური *</div>
          <input type="text" v-model="titleInputText" @keyup="titleValidateInput"
                 :class="{ 'invalid-input': titleIsMinLength === 'invalid', 'valid-input': titleIsMinLength === 'valid' }"
                 class="author-input" placeholder="&#x200A;შეიყვანეთ სათაური">
          <div class="title-validation"
               :class="{ 'red': titleIsMinLength === 'invalid' , 'green': titleIsMinLength === 'valid'}">მინიმუმ 2
            სიმბოლო
          </div>
        </div>
      </div>
      <div class="description-container">
        <div class="description-label">აღწერა *</div>
        <textarea class="custom-textarea" v-model="descriptionInputText" @keyup="descriptionValidateInput"
                  :class="{ 'invalid-input': descriptionIsMinLength === 'invalid', 'valid-input': descriptionIsMinLength === 'valid' }"
                  placeholder="შეიყვანეთ აღწერა"></textarea>
        <div class="title-validation"
             :class="{ 'red': descriptionIsMinLength === 'invalid' , 'green': descriptionIsMinLength === 'valid'}">
          მინიმუმ 2 სიმბოლო
        </div>
      </div>
      <div class="publish-container">
        <div>
          <div class="author-label">გამოქვეყნების თარიღი *</div>
          <input type="date" class="date-input" v-model="dateInputText" @change="dateValidateInput"
                 :class="{ 'invalid-input': dateIsValid === 'invalid', 'valid-input': dateIsValid === 'valid'}">
        </div>
        <div>
          <div class="author-label">კატეგორია</div>
          <div class="categories-container">
            <div class="tags-input" :class="{ 'tags-input-active': dropdownVisible, 'valid-input': tagIsValid === 'valid', 'invalid-input': tagIsValid === 'invalid' }">
              <div v-for="(tag, index) in tags" :key="index" class="category-text-input"
                   :style="{ backgroundColor: tag.background_color, color: tag.text_color }">
                <div class="tag-title">
                  {{ tag.title }}
                </div>
                <span class="remove-tag" @click="removeTag(index)"><img src="../assets/img/white-close.svg"
                                                                        alt="delete" class="delete-button"></span>
              </div>
            </div>
            <div class="dropdown-button" @click="toggleDropdown" :class="{ 'tags-input-active': dropdownVisible, 'valid-input': tagIsValid === 'valid', 'invalid-input': tagIsValid === 'invalid' }">
              <img src="../assets/img/arrow-down.svg" alt="arrow-down" class="dropdown-img">
            </div>
          </div>
          <div v-if="dropdownVisible">
            <div v-for="categoryGroup in categories" class="box">
              <div
                  v-for="(category, index) in categoryGroup"
                  :key="index"
                  class="category-text"
                  @click="addTag(category)"
                  :style="{ backgroundColor: category.background_color, color: category.text_color }"
              >
                {{ category.title }}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="email-container">
        <div class="author-label">ელ-ფოსტა</div>
        <input v-model="emailInputText" @keyup="emailValidateInput"
               :class="{ 'invalid-input': emailIsValid === 'invalid', 'valid-input': emailIsValid === 'valid' }"
               class="email-input" type="email"
               placeholder="&#x200A;Example@redberry.ge">
        <div v-if="emailIsValid === 'invalid'" class="error-message">
          <img src="../assets/img/info-circle.svg" alt="error-image">
          <div class="invalid-email">მეილი უნდა მთავრდებოდეს @redberry.ge-ით</div>
        </div>
      </div>
      <div class="submit-container">
        <div v-if="submitIsValid === 'valid'" @click="submitData" class="publish publish-available">გამოქვეყნება</div>
        <div v-else class="publish">გამოქვეყნება</div>
      </div>
    </div>

    <div v-if="submitSuccess" class="success-form-modal">
      <div class="success-form">
        <img src="../assets/img/tick-circle.svg" alt="success" class="success">
        <div class="success-text">ჩანაწერი წარმატებით დაემატა</div>
        <NuxtLink to="/">
          <div class="success-login-button">მთავარ გვერდზე დაბრუნება</div>
        </NuxtLink>
        <NuxtLink to="/">
          <img src="../assets/img/add.svg" class="close-login" alt="close-button">
        </NuxtLink>
      </div>
    </div>


  </div>
</template>

<style scoped>

  .success-form-modal {
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

  .success-form{
    background-color: white;
    padding: 0 24px;
    border-radius: 12px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
    text-align: center;
    width: 432px;
    height: 300px;
    position: relative;
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
  }

  .success {
    margin-top: 64px;
  }

  .close-login {
    width: 24px;
    height: 24px;
    position: absolute;
    right: 20px;
    top: 20px;
    cursor: pointer;
  }

  .header-container {
    display: flex;
    align-items: center;
    margin-top: 40px;
    padding-left: 76px;
    height: 44px;
  }

  .form-container {
    width: 600px;
    padding-left: 360px;
  }

  .arrow {
    width: 44px;
    height: 44px;
  }

  .head-text {
    display: inline-flex;
    font-size: 32px;
    line-height: 40px;
    color: #1A1A1F;
    font-family: 'FiraGO Bold 700', sans-serif;
    margin-left: 240px;
  }

  .img-label {
    margin-top: 40px;
    color: #1A1A1F;
    font-size: 14px;
    line-height: 20px;
    font-family: 'FiraGO Medium 500', sans-serif;
  }

  .uploaded-file-photo {
    display: flex;
    align-items: center;
    width: 600px;
    height: 56px;
    border-radius: 12px;
    background: #F2F2FA;
    margin-top: 8px;
  }

  .file-not-uploaded {
    width: 600px;
    height: 180px;
    border-radius: 12px;
    border: 1px dashed #85858D;
    background: #F4F3FF;
    margin-top: 8px;
    cursor: pointer;
  }

  .file-not-uploaded:hover {
    background: #F1EFFB;
  }

  .upload-icon {
    margin-top: 48px;
    padding: 0 280px;
  }

  .uploaded-icon {
    padding: 16px 12px 16px 16px;
    width: 24px;
    height: 24px;
  }

  .close-button {
    width: 24px;
    height: 24px;
    padding: 8px;
    cursor: pointer;
    margin-left: auto;
    margin-right: 8px;
    border-radius: 30px;
  }

  .close-button:hover {
    background: #F5F4F9;
  }

  .close-button:active {
    background: #EBEAEF;
  }

  .inside-text {
    margin-top: 24px;
    padding: 0 166px;
    font-size: 14px;
    color: #1A1A1F;
    line-height: 20px;
  }

  .inside-text-span {
    text-decoration: underline;
    font-family: 'FiraGO Medium 500', sans-serif;
  }

  .author-container {
    display: flex;
    justify-content: space-between;
  }


  .author-label {
    margin-top: 24px;
    color: #1A1A1F;
    font-size: 14px;
    line-height: 20px;
    font-family: 'FiraGO Medium 500', sans-serif;
  }

  .author-input {
    margin-top: 8px;
    width: 270px;
    height: 42px;
    border-radius: 12px;
    border: 1px solid #E4E3EB;
    background: #FCFCFD;
    padding: 0 0 0 16px;
    text-align: left;
    line-height: 20px;
    font-size: 14px;
  }

  .author-input::placeholder {
    text-indent: 2px;
  }

  .author-input:focus {
    outline: none;
    border: 1px solid #5D37F3;
    box-shadow: 0 0 0 0.5px #5D37F3;
    background: #F7F7FF;
  }

  .author-validations {
    color: #85858D;
    font-size: 12px;
    line-height: 20px;
    padding-left: 10px;
    list-style: none;
  }

  .author-validations li {
    position: relative;
    line-height: 20px;
    padding-left: 10px;
  }

  .author-validations li::before {
    content: '•';
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    font-size: 12px;
  }

  .title-validation {
    color: #85858D;
    font-size: 12px;
    line-height: 20px;
    margin-top: 8px;
  }

  .description-label {
    color: #1A1A1F;
    font-size: 14px;
    line-height: 20px;
    font-family: 'FiraGO Medium 500', sans-serif;
    margin-top: 24px;
  }

  .custom-textarea {
    margin-top: 8px;
    border-radius: 12px;
    border: 1px solid #E4E3EB;
    background: #FCFCFD;
    width: 582px;
    height: 110px;
    resize: none;
    padding: 12px 0 0 16px;
    font-size: 14px;
    line-height: 20px;
    color: #1A1A1F;
  }

  .custom-textarea:focus {
    outline: none;
    border: 1px solid #5D37F3;
    box-shadow: 0 0 0 0.5px #5D37F3;
    background: #F7F7FF;
  }

  .custom-textarea::placeholder {
    text-indent: 2px;
  }

  .publish-container {
    display: flex;
    justify-content: space-between;
  }

  .date-input {
    margin-top: 8px;
    width: 254px;
    height: 42px;
    border-radius: 12px;
    border: 1px solid #E4E3EB;
    background: #FCFCFD;
    padding: 0 16px;
    text-align: left;
    line-height: 20px;
    font-size: 14px;
  }

  .date-input::placeholder {
    text-indent: 2px;
  }

  .date-input:focus, .date-input:active {
    outline: none;
    border: 1px solid #5D37F3;
    box-shadow: 0 0 0 0.5px #5D37F3;
    background: #F7F7FF;
  }



  /* Categories */

  .categories-container {
    display: flex;
    position: relative;
  }

  .tags-input {
    margin-top: 8px;
    display: flex;
    flex-wrap: nowrap;
    gap: 8px;
    padding: 6px;
    border: 1px solid #E4E3EB;
    border-radius: 12px;
    background: #FCFCFD;
    width: 274px;
    height: 30px;
    overflow: hidden;
  }

  .tags-input-active {
    outline: none;
    border: 1px solid #5D37F3;
    box-shadow: 0 0 0 0.5px #5D37F3;
    background: #F7F7FF;
  }

  .remove-tag {
    margin-left: 8px;
    cursor: pointer;
    width: 16px;
    height: 16px;
  }


  .dropdown-button {
    margin-left: auto;
    cursor: pointer;
    border-radius: 0 10px 10px 0;
    background: transparent;
    padding: 10px 14.5px 10px 5.5px;
    position: absolute;
    right: 1px;
    width: 20px;
    height: 20px;
    top: 10px;
    border: 0 !important;
  }

  .dropdown-img {
    width: 20px;
    height: 20px;
  }

  .category-text {
    padding: 8px 16px;
    border-radius: 30px;
    font-size: 12px;
    line-height: 16px;
    font-family: 'FiraGO Medium 500', sans-serif;
    cursor: pointer;
  }

  .category-text-input {
    display: flex;
    padding: 8px 12px;
    border-radius: 30px;
    font-size: 12px;
    line-height: 16px;
    font-family: 'FiraGO Medium 500', sans-serif;
    cursor: pointer;
  }

  .box {
    position: absolute;
    padding: 16px;
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
    width: 254px;
    //height: 112px;
    gap: 8px;
    border-radius: 12px;
    border: 1px solid #E4E3EB;
    background: #FFF;
    box-shadow: 2px 4px 8px 0 rgba(0, 0, 0, 0.08);
    overflow: hidden;
    scroll-behavior: smooth;
  }

  .tag-title {
    white-space: nowrap;
  }

  .email-input {
    margin-top: 8px;
    width: 270px;
    height: 42px;
    border-radius: 12px;
    border: 1px solid #E4E3EB;
    background: #FCFCFD;
    padding: 0 0 0 16px;
    text-align: left;
    line-height: 20px;
    font-size: 14px;
  }

  .email-input::placeholder {
    text-indent: 2px;
    color: #85858D;
  }

  .email-input:focus {
    outline: none;
    border: 1px solid #5D37F3;
    box-shadow: 0 0 0 0.5px #5D37F3;
    background: #F7F7FF;
  }

  .submit-container {
    padding: 0 0 65px 312px;
  }

  .publish {
    display: flex;
    margin-top: 40px;
    width: 248px;
    padding: 10px 20px;
    justify-content: center;
    align-items: center;
    gap: 10px;
    border-radius: 8px;
    background: #E4E3EB;
    color: #FFF;
    font-size: 14px;
    line-height: 20px;
    font-family: 'FiraGO Medium 500', sans-serif;
  }

  .publish-available {
    background: #5D37F3;
    cursor: pointer;
  }

  .publish-available:hover {
    background: #512BE7;
  }

  .publish-available:active {
    background: #4721DD;
  }

  input:hover, textarea:hover {
    background: #F9F9FA;
  }

  .tags-input:hover {
    background: #F9F9FA;
  }







  /* Error */

  .red {
    color: #EA1919;
  }

  .invalid-input {
    border: 1px solid #EA1919;
    background: #FAF2F3;
    box-shadow: none;
  }

  .invalid-input:focus {
    border: 1px solid #EA1919;
    box-shadow: none;
    background: #FAF2F3;
  }

  .error-message {
    display: flex;
    margin-top: 8px;
    width: 20px;
    height: 20px;
  }

  .error-image {
    color: #EA1919;
    font-size: 12px;
    line-height: 20px;
    margin-top: 8px;
  }

  .invalid-email {
    color: #EA1919;
    line-height: 20px;
    font-size: 12px;
    margin-left: 8px;
    min-width: 260px;
  }

  /* Error */

  .green {
    color: #14D81C;
  }

  .valid-input {
    border: 1px solid #14D81C;
    background: #F8FFF8;
    box-shadow: none;

  }

  .valid-input:focus {
    border: 1px solid #14D81C;
    box-shadow: none;
    background: #F8FFF8;
  }



</style>
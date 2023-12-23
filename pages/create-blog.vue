<script setup>
  definePageMeta({
    layout: 'custom',
    middleware: ['auth'],
  })


  const fileUploaded = ref(false);
  const uploadedFileName = ref('');

  const inputText = ref('');
  const isMinLength = ref('');
  const isMinWords = ref('');
  const isGeorgian = ref('');
  const isValid = ref('');

  function validateInput() {
    const trimmedInput = inputText.value.trim();
    isMinLength.value = trimmedInput.length >= 4 ? 'valid' : 'invalid';

    const words = trimmedInput.split(/\s+/);
    isMinWords.value = words.length >= 2 ? 'valid' : 'invalid';

    const georgianRegex = /^[ა-ჰ]+$/;
    isGeorgian.value = words.every(word => georgianRegex.test(word)) ? 'valid' : 'invalid';

    isValid.value = (isMinLength.value && isMinWords.value && isGeorgian.value) === 'valid' ? 'valid' : 'invalid';
  }

  const checkUploadedFile = () => {
    const fileData = localStorage.getItem('uploadedFile');
    if (fileData) {
      const fileMetadata = JSON.parse(fileData);
      uploadedFileName.value = fileMetadata.name;
      fileUploaded.value = true;
    }
  }

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      uploadedFileName.value = file.name;
      fileUploaded.value = true;
      localStorage.setItem('uploadedFile', JSON.stringify({ name: file.name, size: file.size, type: file.type }));
    }
  }

  const removeFile = () => {
    fileUploaded.value = false;
    uploadedFileName.value = '';
    localStorage.removeItem('uploadedFile');
  };

  const triggerFileInput = () => {
    document.getElementById('file-upload').click();
  };

  const handleDrop = (event) => {
    const files = event.dataTransfer.files;
    processFile(files[0]);
  };

  const processFile = (file) => {
    if (file) {
      uploadedFileName.value = file.name;
      fileUploaded.value = true;
    }
  };

  onMounted(checkUploadedFile);
  onMounted(() => {
    document.body.style.backgroundColor = '#FBFAFF';
  });

  onUnmounted(() => {
    document.body.style.backgroundColor = '';
  });
</script>

<template>
  <div>
    <div class="header-container">
      <NuxtLink to="/">
        <img src="../assets/img/img_5.png" alt="arrow" class="arrow">
      </NuxtLink>
      <div class="head-text">ბლოგის დამატება</div>
    </div>
    <div class="form-container">
      <div class="img-label">
        ატვირთეთ ფოტო
      </div>
      <div class="upload-container">
        <div v-if="!fileUploaded" class="file-not-uploaded" @click="triggerFileInput"
             @dragover.prevent="dragOver"
             @dragleave.prevent="dragLeave"
             @drop.prevent="handleDrop">
          <input type="file" id="file-upload" @change="handleFileUpload" hidden />
            <img src="../assets/img/photo_placeholder.png" alt="photo-placeholder" class="upload-icon"/>
            <div class="inside-text">ჩააგდეთ ფაილი აქ ან <span class="inside-text-span">აირჩიეთ ფაილი</span></div>
        </div>
        <div v-else class="uploaded-file-photo">
            <img src="../assets/img/uploaded_photo_placeholder.png" alt="uploaded-photo-placeholder" class="uploaded-icon"> {{ uploadedFileName }}
            <img src="../assets/img/img_3.png" alt="close-button" @click="removeFile" class="close-button">
        </div>
      </div>
      <div class="author-container">
        <div>
          <div class="author-label">ავტორი *</div>
          <input v-model="inputText" @keyup="validateInput" :class="{ 'invalid-input': isValid === 'invalid', 'valid-input': isValid === 'valid' }" type="text" class="author-input" placeholder="&#x200A;შეიყვანეთ ავტორი">
          <ul class="author-validations">
            <li :class="{ 'red': isMinLength === 'invalid', 'green': isMinLength === 'valid'}">მინიმუმ 4 სიმბოლო</li>
            <li :class="{ 'red': isMinWords === 'invalid' , 'green': isMinWords === 'valid'}">მინიმუმ ორი სიტყვა</li>
            <li :class="{ 'red': isGeorgian === 'invalid' , 'green': isGeorgian === 'valid'}">მხოლოდ ქართული სიმბოლოები</li>
          </ul>
        </div>
        <div>
          <div class="author-label">სათაური *</div>
          <input type="text" class="author-input" placeholder="&#x200A;შეიყვანეთ სათაური">
          <div class="title-validation">მინიმუმ 4 სიმბოლო</div>
        </div>
      </div>
      <div class="description-container">
        <div class="description-label">აღწერა *</div>
        <textarea class="custom-textarea" placeholder="შეიყვანეთ აღწერა"></textarea>
        <div class="title-validation">მინიმუმ 4 სიმბოლო</div>
      </div>
      <div class="publish-container">
        <div>
          <div class="author-label">გამოქვეყნების თარიღი *</div>
          <input type="date" class="date-input">
        </div>
        <div>
          <div class="author-label">გამოქვეყნების თარიღი *</div>
          <select name="" id="">
            <option>hah</option>
          </select>
        </div>

      </div>
    </div>
  </div>
</template>

<style scoped>

  .header-container {
    display: flex;
    align-items: center;
    margin-top: 40px;
    padding-left: 76px;
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
    padding: 16px 16px 16px 0;
    cursor: pointer;
    margin-left: auto;
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
    width: 272px;
    height: 44px;
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
    width: 584px;
    height: 124px;
    resize: none;
    padding: 12px 0 0 16px;
    font-size: 14px;
    line-height: 20px;
    color: #85858D;
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
  }

  .date-input {
    margin-top: 8px;
    width: 272px;
    height: 44px;
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

  .date-input:focus {
    outline: none;
    border: 1px solid #5D37F3;
    box-shadow: 0 0 0 0.5px #5D37F3;
    background: #F7F7FF;
  }

  /* Error */

  .red {
    color: #EA1919;
  }

  .green {
    color: #14D81C;
  }

  .invalid-input {
    border: 1px solid #EA1919;

    background: #FAF2F3;
  }

  .invalid-input:focus {
    border: 1px solid #EA1919;
    box-shadow: none;
    background: #FAF2F3;
  }

  .valid-input {
    border: 1px solid #14D81C;

    background: #F8FFF8;
  }

  .valid-input:focus {
    border: 1px solid #14D81C;
    box-shadow: none;

    background: #F8FFF8;
  }


</style>
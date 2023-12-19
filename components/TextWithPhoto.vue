<script setup lang="ts">

</script>

<template>
  <div class="text-with-photo">
    <div class="text-container">
      <p class="">ბლოგი</p>
    </div>
    <div class="photo-container">
      <img src="../assets/img/img_1.png" alt="photo" class="photo">
    </div>
  </div>
</template>

<style scoped>
  .text-with-photo {
    display: flex;
    text-align: center;
    margin-top: 100px;
    padding: 0 90px;
  }

  .text-container {
    flex: 1;
    font-size: 64px;
    font-weight: 900;
    line-height: 72px;
    text-align: left;
  }

  .photo {
    width: 624px;
    height: 200px;
  }
</style>
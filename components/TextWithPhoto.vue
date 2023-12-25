<script setup lang="ts">

</script>

<template>
  <div class="text-with-photo">
    <div class="text-container">
      <p>ბლოგი</p>
    </div>
    <div class="photo-container">
      <img src="../assets/img/banner.svg" alt="photo" class="photo">
    </div>
  </div>
</template>

<style scoped>
  .text-with-photo {
    display: flex;
    text-align: center;
    margin-top: 64px;
    padding-left: 89px;
    padding-right: 76px;
  }


  .text-container {
    flex: 1;
    font-size: 64px;
    font-weight: 900;
    line-height: 72px;
    text-align: left;
    font-family: 'FiraGO Bold 700', sans-serif;
  }

  .photo {
    width: 624px;
    height: 200px;
  }
</style>
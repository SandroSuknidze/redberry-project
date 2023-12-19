<script setup lang="ts">

const blogs = ref([]);
const selectedCategory = ref(null);

const filterBlogs = (category) => {
  selectedCategory.value = category;
}

const fetchData = async () => {
  try {
    const response = await fetch(`${process.env.apiUrl}/blogs`);
    blogs.value = await response.json();
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

onMounted(() => {
  fetchData();
});
</script>

<template>
  <div>

  </div>
</template>

<style scoped>

</style>
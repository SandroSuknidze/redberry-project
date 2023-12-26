<script setup>

const blog = ref();
const route = useRoute();
const runtimeConfig = useRuntimeConfig()
const token = '2ee1d522f9401a177a2f3e1a6f9fb8e992e9a2151c22d9186ec7794590751cd3';
const fetched = ref(false);

const fetchBlogData = async () => {
  try {
    const response = await fetch(`${runtimeConfig.public.apiBase}/blogs/${route.params.id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      }
    });
    if (response.ok) {
      blog.value = await response.json();
      fetched.value = true;
    } else {
      console.error('Error fetching categories:', response.statusText);
    }
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
};

onMounted(fetchBlogData);
onMounted(() => {
  document.body.style.backgroundColor = '#FBFAFF';
});

onUnmounted(() => {
  document.body.style.backgroundColor = '';
});
</script>

<template>
  <div v-if="fetched" class="blog-post">
    <h1>{{ blog.title }}</h1>
    <img :src="blog.image" alt="Blog Image">
    <p>Posted by {{ blog.author }} on {{ formatDate(blog.publish_date) }}</p>
     Add more blogs content here
  </div>
</template>


<style scoped>
  .blog-post {
    width: 720px;
    text-align: center;
    margin: auto;
  }
</style>
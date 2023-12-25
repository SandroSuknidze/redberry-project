<script setup>

const blogs = ref([]);
const selectedCategory = ref(null);
const runtimeConfig = useRuntimeConfig()

const categories = ref([]);
const token = '2ee1d522f9401a177a2f3e1a6f9fb8e992e9a2151c22d9186ec7794590751cd3';

const filterBlogs = (category) => {
  selectedCategory.value = category;
}

const fetchBlogs = async () => {
  const url = `${runtimeConfig.public.apiBase}/blogs`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    blogs.value = await response.json();
  } catch (error) {
    console.error('Error fetching blogs:', error);
  }
};


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
onMounted(() => {
  fetchCategories();
  fetchBlogs();
});
</script>

<template>
  <div class="filterable-blog-list">
    <div v-for="categoryGroup in categories" class="categories-scroll-container">
      <div v-for="category in categoryGroup" :key="category.id" class="category-container">
        <div :style="{ backgroundColor: category.background_color, color: category.text_color }" class="category-text">
          {{ category.title }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.filterable-blog-list {
  margin-top: 64px;
  padding: 0 378px;
}

.categories-scroll-container {
  display: flex;
  overflow-x: auto;
  white-space: nowrap;
  padding-bottom: 10px;
  margin-bottom: 20px;
}

.category-container {
  display: inline-flex;
  margin-right: 24px;
}

.category-text {
  padding: 8px 16px;
  border-radius: 30px;
  font-size: 12px;
  line-height: 16px;
  font-family: 'FiraGO Medium 500', sans-serif;
  cursor: pointer;
}



.categories-scroll-container::-webkit-scrollbar {
  height: 10px;
}

.categories-scroll-container::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.categories-scroll-container::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 10px;
}

.categories-scroll-container::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>
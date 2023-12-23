<script setup>

const blogs = ref([]);
const selectedCategory = ref(null);
const runtimeConfig = useRuntimeConfig()

const categories = ref([]);

const filterBlogs = (category) => {
  selectedCategory.value = category;
}

// const fetchData = async () => {
//   try {
//     const response = await fetch(`${runtimeConfig.public.apiBase}/blogs`, {
//       method: 'GET',
//       headers: {
//         'Accept': 'application/json',
//       }
//     });
//     console.log(response);
//     blogs.value = await response.json();
//   } catch (error) {
//     console.error('Error fetching data:', error);
//   }
// };

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
      console.log('Categories data:', categories);
    } else {
      console.error('Error fetching categories:', response.statusText);
    }
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};
onMounted(() => {
  fetchCategories();
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
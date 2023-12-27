<script setup>

const blogs = ref([]);
const selectedCategories = ref([]);
const runtimeConfig = useRuntimeConfig()

const categories = ref([]);
const now = ref(new Date());
const token = '2ee1d522f9401a177a2f3e1a6f9fb8e992e9a2151c22d9186ec7794590751cd3';


setInterval(() => {
  now.value = new Date();
}, 60000);

const toggleCategory = (categoryTitle) => {
  const index = selectedCategories.value.indexOf(categoryTitle);

  if (index > -1) {
    selectedCategories.value.splice(index, 1);
  } else {
    selectedCategories.value.push(categoryTitle);
  }

  localStorage.setItem('selectedCategories', JSON.stringify(selectedCategories.value));
}

const filteredBlogs = computed(() => {
  if (selectedCategories.value.length === 0) {
    return blogs.value;
  }
  return blogs.value.filter(blog => blog.categories.some(category => selectedCategories.value.includes(category.title)));
});

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

    const responseData = await response.json();
    blogs.value = responseData.data;
    console.log(blogs.value)
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

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
};


onMounted(() => {
  fetchCategories();
  fetchBlogs();
  const savedFilters = localStorage.getItem('selectedCategories');
  if (savedFilters) {
    selectedCategories.value = JSON.parse(savedFilters);
  }
});
</script>

<template>
  <div>
    <div class="filterable-blog-list">
      <div v-for="categoryGroup in categories" class="categories-scroll-container">
        <div v-for="category in categoryGroup" :key="category.id" class="category-container">
          <div @click="toggleCategory(category.title)"
               :class="{ 'selected-category': selectedCategories.includes(category.title) }"
               :style="{ backgroundColor: category.background_color, color: category.text_color }"
               class="category-text">
            {{ category.title }}
          </div>
        </div>
      </div>
    </div>
    <div class="blogs-container">
      <div v-for="blog in filteredBlogs" :key="blog.id">
        <div v-if="new Date(blog.publish_date) < now" class="blog-item">
          <img :src="blog.image" alt="image" class="blog-image">
          <div class="blog-author">{{ blog.author }}</div>
          <div class="publish-date">{{ formatDate(blog.publish_date) }}</div>
          <div class="blog-title"><p class="line-clamp-2">{{ blog.title }}</p></div>
          <div class="categories">
            <div v-for="category in blog.categories" class="category-container-blog">
              <div :style="{ backgroundColor: category.background_color, color: category.text_color}"
                   class="category-text cursor-default">
                {{ category.title }}
              </div>
            </div>
          </div>
          <div class="blog-description">
            <p class="line-clamp-2">{{ blog.description }}</p>
          </div>
          <NuxtLink :to="`/blogs/${blog.id}`">
            <div class="blog-view-container">
              <div class="blog-view">სრულად ნახვა</div>
              <img src="~/assets/img/Arrow-purple.svg" alt="arrow-purple" class="blog-arrow">
            </div>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.selected-category {
  border-radius: 30px;
  border: 1px solid #000;
  background: #EEE1F7;
  padding: 7px 15px !important;
}

.blog-arrow {
  margin-left: 4px;
}

.blog-view-container {
  margin-top: 16px;
  display: inline-flex;
  cursor: pointer;
}

.blog-view {
  color: #5D37F3;
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
  font-family: 'FiraGO Medium 500', sans-serif;
}

.blog-description {
  margin-top: 16px;
  color: #404049;
  font-size: 16px;
  font-weight: 400;
  line-height: 28px;
  height: 56px;
}
.category-container-blog {
  display: inline-flex;
  gap: 16px;
  word-break: break-all;
}

.categories {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 16px;
}

.blog-title {
  margin-top: 16px;
  color: #1A1A1F;
  font-size: 20px;
  line-height: 28px;
  font-family: 'FiraGO Medium 500', sans-serif;
  height: 56px;
  word-wrap: break-word;
}

.publish-date {
  margin-top: 8px;
  color: #85858D;
  font-size: 12px;
  font-weight: 400;
  line-height: 16px;
}

.blog-author {
  margin-top: 24px;
  color: #1A1A1F;
  font-size: 16px;
  line-height: 20px;
  font-family: 'FiraGO Medium 500', sans-serif;
}

.blog-image {
  width: 408px;
  height: 328px;
  border-radius: 12px;
}

.blog-item {
  width: 408px;
  margin-right: 32px;
  padding-bottom: 56px;
}

.blogs-container {
  display: flex;
  flex-wrap: wrap;
  padding: 64px 76px 0 76px;
  justify-content: center;
}

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

.cursor-default {
  cursor: default;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin: 0;
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
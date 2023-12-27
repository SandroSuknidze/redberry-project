<script setup>

const blog = ref();
const route = useRoute();
const runtimeConfig = useRuntimeConfig()
const token = '2ee1d522f9401a177a2f3e1a6f9fb8e992e9a2151c22d9186ec7794590751cd3';
const fetched = ref(false);

const allBlogs = ref([]);
const relatedBlogs = ref([]);

const now = ref(new Date());

setInterval(() => {
  now.value = new Date();
}, 60000);

const fetchAllBlogs = async () => {
  try {
    const response = await fetch(`${runtimeConfig.public.apiBase}/blogs`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      }
    });
    if (response.ok) {
      const responseData = await response.json();
      allBlogs.value = responseData.data;
    } else {
      console.error('Error fetching blogs:', response.statusText);
    }
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

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
      filterRelatedBlogs();
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

const filterRelatedBlogs = () => {
  const categoryIds = new Set(blog.value.categories.map(cat => cat.id));
  relatedBlogs.value = allBlogs.value.filter(b =>
      b.id !== blog.value.id &&
      b.categories.some(cat => categoryIds.has(cat.id))
  );
};

onMounted(async () => {
  await fetchAllBlogs();
  await fetchBlogData();
});
onMounted(() => {
  document.body.style.backgroundColor = '#FBFAFF';
});

onUnmounted(() => {
  document.body.style.backgroundColor = '';
});
</script>

<template>
  <div>
    <div v-if="fetched" class="blog-post">
      <img :src="blog.image" alt="Blog Image" class="image">
      <div class="author">{{ blog.author }}</div>
      <div class="date-email">{{ formatDate(blog.publish_date) }} • {{ blog.email }}</div>
      <div class="title">{{ blog.title }}</div>
      <div class="categories">
        <div v-for="category in blog.categories" class="category-container-blog">
          <div :style="{ backgroundColor: category.background_color, color: category.text_color}"
               class="category-text cursor-default">
            {{ category.title }}
          </div>
        </div>
      </div>
      <div class="description" style="white-space: pre-line">{{ blog.description }}</div>
    </div>
    <div>
      <div class="head">
        <div class="similar">მსგავსი სტატიები</div>
        <div class="arrows-container">
          <div class="prev-arrow first-arrow">
            <img src="~/assets/img/Arrow.svg">
          </div>
          <div class="next-arrow">
            <img src="~/assets/img/arrow-big-purple.svg">
          </div>
        </div>
      </div>


      <div v-if="relatedBlogs.length" class="blogs-container">
        <div v-for="relatedBlog in relatedBlogs" :key="relatedBlog.id" class="related-blog">
          <div v-if="new Date(relatedBlog.publish_date) < now" class="blog-item">
            <img :src="relatedBlog.image" alt="image" class="blog-image">
            <div class="blog-author">{{ relatedBlog.author }}</div>
            <div class="publish-date">{{ formatDate(relatedBlog.publish_date) }}</div>
            <div class="blog-title"><p class="line-clamp-2">{{ relatedBlog.title }}</p></div>
            <div class="categories">
              <div v-for="category in relatedBlog.categories" class="category-container-blog">
                <div :style="{ backgroundColor: category.background_color, color: category.text_color}"
                     class="category-text cursor-default">
                  {{ category.title }}
                </div>
              </div>
            </div>
            <div class="blog-description">
              <p class="line-clamp-2">{{ relatedBlog.description }}</p>
            </div>
            <NuxtLink :to="`/blogs/${relatedBlog.id}`">
              <div class="blog-view-container">
                <div class="blog-view">სრულად ნახვა</div>
                <img src="~/assets/img/Arrow-purple.svg" alt="arrow-purple" class="blog-arrow">
              </div>
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>

</template>


<style scoped>
.first-arrow {
  margin-right: 24px;
}

.arrows-container {
  display: flex;
}
.head {
  display: flex;
  justify-content: space-between;
  margin-top: 98px;
}

.similar {
  color: #1A1A1F;
  font-size: 32px;
  line-height: 40px;
  font-family: 'FiraGO Bold 700', sans-serif;
  text-align: left;
}

.description {
  margin-top: 40px;
  color: #404049;
  font-size: 16px;
  line-height: 28px;
  text-align: left;
}

.categories {
  margin-top: 24px;
  text-align: left;
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}
  .category-text {
    padding: 8px 16px;
    border-radius: 30px;
    font-size: 12px;
    line-height: 16px;
    font-family: 'FiraGO Medium 500', sans-serif;
    cursor: pointer;
  }

  .category-container-blog {
    display: inline-flex;
    word-break: break-all;
  }

  .cursor-default {
    cursor: default;
  }

  .title {
    margin-top: 24px;
    color: #1A1A1F;
    font-size: 32px;
    line-height: 40px;
    font-family: 'FiraGO Bold 700', sans-serif;
    text-align: left;
  }

  .date-email {
    margin-top: 8px;
    color: #85858D;
    font-size: 12px;
    line-height: 16px;
    text-align: left;
  }

  .author {
    margin-top: 40px;
    text-align: left;
    color: #1A1A1F;
    font-size: 16px;
    line-height: 20px;
    font-family: 'FiraGO Medium 500', sans-serif;
  }

  .blog-post {
    width: 720px;
    text-align: center;
    margin: auto;
  }

  .image {
    margin-top: 40px;
    width: 720px;
    height: 328px;
  }
</style>
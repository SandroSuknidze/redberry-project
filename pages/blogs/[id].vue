<script setup>

import hoveredArrow from "assets/img/Arrow-hover.svg";
import activeArrow from "assets/img/Arrow-active.svg";
import defaultArrow from "assets/img/Arrow.svg";

const blog = ref();
const route = useRoute();
const runtimeConfig = useRuntimeConfig()
const token = '2ee1d522f9401a177a2f3e1a6f9fb8e992e9a2151c22d9186ec7794590751cd3';
// const token = 'e18e81d3795e2a1d84053f7a25a13c7ea1493a5427ece1cdce064172898cb4e3';
const fetched = ref(false);

const allBlogs = ref([]);
const relatedBlogs = ref([]);

const currentSlide = ref(0);
const blogsPerSlide = 3;

const state = ref('');

const nextSlide = () => {
  if ((currentSlide.value + 1) * blogsPerSlide < relatedBlogs.value.length) {
    currentSlide.value++;
  }
};

const prevSlide = () => {
  if (currentSlide.value > 0) {
    currentSlide.value--;
  }
};


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
    <NuxtLink to="/">
      <img :src="getImageSource"
           @mouseover="state = 'hover'"
           @mouseleave="state = 'normal'"
           @mousedown="state = 'active'"
           alt="arrow" class="arrow">
    </NuxtLink>
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
      <div class="related-blogs-section">
        <div class="head">
          <div class="similar">მსგავსი სტატიები</div>

          <div class="arrows-container">
            <div :class="{ 'svg-container-previous-disabled': currentSlide === 0,  'svg-container-previous-available': currentSlide > 0}" @click="prevSlide">
              <img src="~/assets/img/arrow-white.svg" class="svg-arrow-left">
            </div>
            <div :class="{ 'svg-container-next-available':  (currentSlide + 1) * blogsPerSlide < relatedBlogs.length, 'svg-container-next-disabled': (currentSlide + 1) * blogsPerSlide >= relatedBlogs.length }" @click="nextSlide">
              <img src="~/assets/img/arrow-white.svg" class="svg-arrow-right">
            </div>

          </div>
        </div>

        <div class="blogs-slider">
          <div v-for="(relatedBlog, index) in relatedBlogs" :key="relatedBlog.id" v-show="index >= currentSlide * blogsPerSlide && index < (currentSlide + 1) * blogsPerSlide">
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
  </div>

</template>


<style scoped>
.arrow {
  width: 44px;
  height: 44px;
  margin-left: 76px;
  margin-top: 40px;
}

.svg-container-previous-disabled {
  width: 44px;
  height: 44px;
  position: relative;
  background-color: #E4E3EB;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 24px;
  user-select: none;

}

.svg-container-next-disabled {
  width: 44px;
  height: 44px;
  position: relative;
  background-color: #E4E3EB;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  user-select: none;

}

.svg-container-previous-available{
  width: 44px;
  height: 44px;
  position: relative;
  background-color: #5D37F3;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 24px;
  cursor: pointer;
  user-select: none;

}

.svg-container-previous-available:hover {
  background-color: #512BE7;
}

.svg-container-previous-available:active {
  background-color: #4721DD;
}


.svg-container-next-available {
  width: 44px;
  height: 44px;
  position: relative;
  background-color: #5D37F3;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  user-select: none;
}

.svg-container-next-available:hover {
  background-color: #512BE7;
}

.svg-container-next-available:active {
  background-color: #4721DD;
}



.svg-arrow-right {
  width: 50%;
  height: auto;
  transform: rotate(-90deg);
}

.svg-arrow-left {
  width: 50%;
  height: auto;
  transform: rotate(90deg);
}




.related-blogs-section {
  padding: 0 376px;
}
.blogs-slider {
  display: flex;
  width: 100%;
  justify-content: center;
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

.prev-arrow {
  margin-right: 24px;
  cursor: pointer;
}
.next-arrow {
  cursor: pointer;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin: 0;
}

.arrows-container {
  display: flex;
}
.head {
  display: flex;
  justify-content: space-between;
  margin-top: 98px;
  margin-bottom: 40px;
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
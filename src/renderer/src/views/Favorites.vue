<template>
  <div id="FavoritesWallpaper" class="h-full w-full relative">
    <component :is="currentComponent" />
    <PageTabs :tabOptions="tabOptions" @changeTab="changeTab" />
  </div>
</template>

<script setup>
import { ref, markRaw } from 'vue'
import FavoriteImage from '../components/FavoriteImage.vue'
import FavoriteVideo from '../components/FavoriteVideo.vue'
import { usePage } from '../composables/usePageTabs'

const tabOptions = ref([
  {
    name: 'image',
    label: '图片壁纸',
    component: markRaw(FavoriteImage),
    active: true
  },
  {
    name: 'video',
    label: '视频壁纸',
    component: markRaw(FavoriteVideo),
    active: false
  }
])

const { currentComponent, changeTab } = usePage(tabOptions)

</script>

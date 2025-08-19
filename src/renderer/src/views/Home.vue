<template>
  <div id="home" class="h-full relative">
    <keep-alive>
      <component :is="currentComponent" />
    </keep-alive>
    <PageTabs :tabOptions="tabOptions" @changeTab="changeTab" />
  </div>
</template>

<script setup>
import { ref, markRaw } from 'vue'
import WallpaperList from '../components/WallpaperList.vue'
import videoList from '../components/VideoList.vue'
import { usePage } from '../composables/usePageTabs'

const tabOptions = ref([
  {
    name: 'image',
    label: '图片壁纸',
    component: markRaw(WallpaperList),
    active: true
  },
  {
    name: 'video',
    label: '视频壁纸',
    component: markRaw(videoList),
    active: false
  }
])

const { currentComponent, changeTab } = usePage(tabOptions)

</script>


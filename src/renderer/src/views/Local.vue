<template>
  <div id="localWallpaper" class="h-full w-full relative">
    <component :is="currentComponent" />
    <PageTabs :tabOptions="tabOptions" @changeTab="changeTab" />
  </div>
</template>

<script setup>
import { ref, markRaw } from 'vue'
import LocalImage from '../components/LocalImage.vue'
import LocalVideo from '../components/LocalVideo.vue'
import { usePage } from '../composables/usePageTabs'

const tabOptions = ref([
  {
    name: 'image',
    label: '图片壁纸',
    component: markRaw(LocalImage),
    active: true
  },
  {
    name: 'video',
    label: '视频壁纸',
    component: markRaw(LocalVideo),
    active: false
  }
])

const { currentComponent, changeTab } = usePage(tabOptions)

</script>

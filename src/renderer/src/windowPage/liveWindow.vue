<template>
  <div class="liveWindow h-screen w-screen">
    <video ref="video" class="h-full w-full object-cover" :src="livePath" autoplay loop></video>
  </div>
</template>
<script setup>
import '@renderer/assets/css/cursorWindow.css'
import useSettingStore from '@renderer/store/setting'
import { ref, onMounted, computed } from 'vue'
const { setting } = useSettingStore()

// const video = ref(null)
const path = ref(setting.livePath)

const livePath = computed(() => {
  // console.log('path', setting.livePath ? 'file://' + setting.livePath : '' )
    return path.value ? 'file://' + path.value : '' 
})
window.electronAPI.updateLivePath((videoPath) => {
    path.value !== videoPath && (path.value = videoPath)
})
onMounted(() => {
    // console.log('video', video.value, setting)
})

</script>
<style scoped>
.liveWindow {
    height: 100vh;
    width: 100vw;
}
</style>
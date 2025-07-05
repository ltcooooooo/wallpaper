<template>
    <div id="localWallpaper" class="h-full">
        <el-scrollbar>
            <div
                class="h-full flex flex-wrap justify-center p-4 gap-3 overflow-auto">
                <div 
                    class="w-75 h-50 rounded-md overflow-hidden shadow-xl transition-all hover:shadow-2xl hover:translate-y-[-2px]"
                    v-for="item in wallpaperList" :key="item.imgSrc">
                    <Card :image="item" :isLocal="true" @delWallpaper="delLocaWallpaper" />
                </div>
            </div>
        </el-scrollbar>
    </div>
</template>

<script setup>
import useSettingStore from '@renderer/store/setting'
import { ref } from 'vue'
const { setting } = useSettingStore()
const wallpaperList = ref([])
getLocalWallpaper()

async function getLocalWallpaper() {
    const result = await window.electronAPI.getLocalWallpaper(setting.wallpaperSavePath)
    console.log(result)
    const list = result.data.map(item => {
        const blob = new Blob([item.imgBuffer], { type: 'image/jpeg' })
        const url = URL.createObjectURL(blob)
        return {
            smallSrc: url,
            imgSrc: item.imgSrc,
            size: item.size,
        }
    })
    wallpaperList.value = list
}

function delLocaWallpaper(path) {
    const index = wallpaperList.value.findIndex(item => item.imgSrc === path)
    setTimeout(()=>wallpaperList.value.splice(index, 1), 400)
    
}
</script>

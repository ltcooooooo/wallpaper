<template>
    <section class="card w-full h-full relative group animate__animated" :class="{'animate__fadeOut': isDel}">
        <img :src="image.smallSrc" alt="" class="object-cover min-h-full min-w-full">
        <section
            class="absolute bottom-0 left-0 bg-[rgba(0,0,0,.4)] text-xs flex items-center justify-between px-3 w-full h-9 translate-y-[100%]  group-hover:translate-y-0 transition">
            <div class="text-white">{{ image.size }}</div>
            <div class="text-white">
                <my-tooltip v-if="buttonShow.favorite" content="收藏">
                    <el-button type="warning" size="small" @click="addFavorites(image)"><i-ep-star /></el-button>
                </my-tooltip>
                <my-tooltip v-if="buttonShow.unFavorite" content="取消收藏">
                    <el-button type="warning" size="small" @click="delFavorites(image, isFavoritePage)"><i-ep-star-filled /></el-button>
                </my-tooltip>
                <my-tooltip v-if="buttonShow.download" content="下载">
                    <el-button type="success" size="small" @click="downloadWallpaper" :loading="isLoading"><i-ep-download v-show="!isLoading" /></el-button>
                </my-tooltip>
                <my-tooltip v-if="buttonShow.local" content="删除">
                    <el-button type="danger" size="small" @click="delLocalWallpaper"><i-ep-delete /></el-button>
                </my-tooltip>
                <my-tooltip content="设为壁纸">
                    <el-button type="primary" size="small" @click="setWallpaper({ isLocalPage })" :loading="isLoading"><i-ep-platform v-show="!isLoading" /></el-button>
                </my-tooltip>
            </div>
        </section>
    </section>
</template>
<script setup>
import useCard from '../composables/useCard'
import { computed } from 'vue'
const emit = defineEmits(['delWallpaper'])
const { image, page } = defineProps(['image', 'page'])
const isLocalPage = page === 'local'
const isFavoritePage = page === 'favorites'

const { isLoading, isFavorite, isDel, downloadWallpaper, setWallpaper, delLocalWallpaper, addFavorites, delFavorites } = useCard(image, emit)
const buttonShow = computed(()=>({
    favorite: !isFavorite.value,
    unFavorite: isFavorite.value,
    download: !isLocalPage,
    local: isLocalPage
}))
</script>
<style scoped>
:deep(.el-button--small) {
    position: relative;
    width: 35px;
    font-size: 14px;
}
:deep(.el-button--small .is-loading) {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%
}
</style>
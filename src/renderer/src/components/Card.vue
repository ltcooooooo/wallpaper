<template>
    <section class="card w-full h-full relative group animate__animated" :class="{'animate__fadeOut': isDel}">
        <img :src="cardImageSrc" alt="" class="object-cover min-h-full min-w-full">
        <slot 
            :data="data"
            :addFavorites="addFavorites" 
            :delFavorites="delFavorites"
            :isLoading="isLoading"
            :isFavorite="isFavorite"
            :downloadWallpaper="downloadWallpaper"
            :setWallpaper="setWallpaper"
            :delLocalWallpaper="delLocalWallpaper"
        />
            <!-- :isFavoritePage="isFavoritePage" -->
            <!-- :isLocalPage="isLocalPage" -->
        <!-- <section
            class="absolute bottom-0 left-0 bg-[rgba(0,0,0,.4)] text-xs flex items-center justify-between px-3 w-full h-9 translate-y-[100%]  group-hover:translate-y-0 transition">
            <div class="text-white">{{ data.size }}</div>
            <div class="text-white">
                <my-tooltip v-if="buttonShow.favorite" content="收藏">
                    <el-button type="warning" size="small" @click="addFavorites(data)"><i-ms-kid-star-outline /></el-button>
                </my-tooltip>
                <my-tooltip v-if="buttonShow.unFavorite" content="取消收藏">
                    <el-button type="warning" size="small" @click="delFavorites(data, isFavoritePage)"><i-ms-kid-star /></el-button>
                </my-tooltip>
                <my-tooltip v-if="buttonShow.download" content="下载">
                    <el-button type="success" size="small" @click="downloadWallpaper" :loading="isLoading"><i-ms-download-rounded v-show="!isLoading" /></el-button>
                </my-tooltip>
                <my-tooltip v-if="buttonShow.local" content="删除">
                    <el-button type="danger" size="small" @click="delLocalWallpaper"><i-ms-delete-outline-rounded /></el-button>
                </my-tooltip>
                <my-tooltip content="设为壁纸">
                    <el-button type="primary" size="small" @click="setWallpaper({ isLocalPage })" :loading="isLoading"><i-ms-desktop-mac v-show="!isLoading" /></el-button>
                </my-tooltip>
            </div>
        </section> -->
    </section>
</template>
<script setup>
import useCard from '../composables/useCard'
const emit = defineEmits(['delWallpaper'])
const { data, page } = defineProps(['data', 'page'])
console.log('data', data, page)
// const isLocalPage = page === 'local'
// const isFavoritePage = page === 'favorites'

const { isLoading, isFavorite, isDel, cardImageSrc, downloadWallpaper, setWallpaper, delLocalWallpaper, addFavorites, delFavorites } = useCard({data, emit, page})

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
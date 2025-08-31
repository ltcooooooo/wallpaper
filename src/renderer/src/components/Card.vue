<template>
    <section class="card w-full h-full relative group animate__animated" :class="{'animate__fadeOut': isDel}">
        <img :src="cardImageSrc" alt="" class="object-cover min-h-full min-w-full">
        <slot 
            :data="data"
            :changeFavoritesStatus="changeFavoritesStatus"
            :isLoading="isLoading"
            :isFavorite="isFavorite"
            :downloadWallpaper="downloadWallpaper"
            :setWallpaper="setWallpaper"
            :delLocalWallpaper="delLocalWallpaper"
            :delFavoritesImage="delFavoritesImage"
        />
    </section>
</template>
<script setup>
import useCard from '../composables/useCard'
import { onActivated } from 'vue'
const { data, page } = defineProps(['data', 'page'])

// 切换页面后再进入检测收藏状态
onActivated(()=> {
    pageOptions[page].getFavoriteStatusFn && pageOptions[page].getFavoriteStatusFn().then(res => {
        isFavorite.value = !!res.data
    })
})
const { 
    isLoading, 
    isFavorite, 
    isDel, 
    cardImageSrc,
    pageOptions, 
    downloadWallpaper, 
    setWallpaper, 
    delLocalWallpaper, 
    changeFavoritesStatus,
    delFavoritesImage
} = useCard({data, page})

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
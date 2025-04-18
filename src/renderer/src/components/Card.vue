<template>
    <section class="card w-full h-full relative group">
        <img :src="image.smallSrc" alt="" class="object-cover min-h-full min-w-full">
        <section
            class="absolute bottom-0 left-0 bg-[rgba(0,0,0,.4)] text-xs flex items-center justify-between px-3 w-full h-9 translate-y-[100%]  group-hover:translate-y-0 transition">
            <div class="text-white">{{ image.size }}</div>
            <div class="text-white">
                <!-- <el-button-group class="flex"> -->
                <el-button type="warning" size="small"><i-ep-star-filled /></el-button>
                <el-button type="success" size="small" @click="downloadWallpaper" :loading="isLoading"><i-ep-download v-show="!isLoading" /></el-button>
                <el-button type="primary" size="small" @click="setWallpaper" :loading="isLoading"><i-ep-platform v-show="!isLoading" /></el-button>
                <!-- </el-button-group> -->

            </div>
        </section>
    </section>
</template>
<script setup>
import useCard from '../composables/useCard'
const { image } = defineProps(['image'])
const { isLoading, downloadWallpaper, setWallpaper } = useCard(image)
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
<template>
    <div class="h-full">
        <wallpaper-search :init="init"/>
        <el-scrollbar @scroll="wallpaperListScroll" ref="wallpaperListScrollRef">
            <div ref="wallpaperListRef"
                class="h-full flex flex-wrap justify-center p-4 pt-0 gap-3 overflow-auto">
                <div class="w-75 h-50 rounded-md overflow-hidden shadow-xl transition-all hover:shadow-2xl hover:translate-y-[-2px]"
                    v-for="item in wallpaperList.images" :key="item.imgSrc">
                    <Card :image="item" />
                </div>
            </div>
            <div class="flex justify-center pb-3 mb-[50px]">
                <div v-show="loading"><i-line-md-loading-twotone-loop class="text-2xl" /></div>
                <div class="cursor-pointer text-red-500 text-sm" @click="reloadingFn" v-show="reloading">加载失败了，点击重试
                </div>
                <div v-show="noMore" class="text-sm text-center text-gray-600">没有更多了哦</div>
            </div>
        </el-scrollbar>
    </div>
</template>
<script setup>
import { ref } from 'vue'
import useWallpaperList from '../composables/useWallpaperList'
import useSearchParame from '../composables/useSearchParame'
//滚动容器
const wallpaperListScrollRef = ref(null)
//滚动列表
const wallpaperListRef = ref(null)

const { params } = useSearchParame()
const { wallpaperList, loading, reloading, noMore, init, reloadingFn, wallpaperListScroll } = useWallpaperList({
    wallpaperListScrollRef,
    wallpaperListRef,
    params
})

init()

</script>

<style scoped>
:deep(.el-tag__close) {
    display: none;
}

:deep(.el-select__suffix) {
    display: none;
}

:deep(.el-select__wrapper.is-focused) {
    box-shadow: none;
}
</style>
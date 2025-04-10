<template>
    <div class="h-full">
        <section
            class="bg-gray-000 py-2 h-12 grid grid-cols-4 items-center px-3 gap-2 gap-y-1 w-fit min-w-[556px] max-[556px]:grid-cols-2 max-[556px]:min-w-[320px] max-[556px]:h-18">
            <el-select v-model="wallpaperFilter.value.categories" multiple size="small" style="width:126px"
                @change="categoriesChange">
                <el-option v-for="item in wallpaperFilter.options.categories" :key="item.value" :label="item.label"
                    :value="item.value" />
            </el-select>
            <el-select v-model="wallpaperFilter.value.sorting" size="small" style="width: 126px">
                <el-option v-for="item in wallpaperFilter.options.sorting" :key="item.value" :label="item.label"
                    :value="item.value" />
            </el-select>
            <el-select v-show="showTopRange" v-model="wallpaperFilter.value.topRange" size="small" style="width: 126px">
                <el-option v-for="item in wallpaperFilter.options.topRange" :key="item.value" :label="item.label"
                    :value="item.value" />
            </el-select>
            <el-button size="small" style="width:34px" @click="refreshList(init)"><i-ep-refresh /></el-button>
        </section>
        <el-scrollbar @scroll="wallpaperListScroll" ref="wallpaperListScrollRef">
            <div ref="wallpaperListRef"
                class="h-full grid p-4 pt-0 gap-3 justify-items-center grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 overflow-auto">
                <div class="w-75 h-50 rounded-md overflow-hidden shadow-xl transition-all hover:shadow-2xl hover:translate-y-[-2px]"
                    v-for="item in wallpaperList.images" :key="item.imgSrc">
                    <Card :image="item" />
                </div>
            </div>
            <div class="flex justify-center pb-3 mb-[50px]">
                <div v-show="loading"><i-ep-loading class="text-2xl motion-safe:animate-spin" /></div>
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

const { wallpaperFilter, params, showTopRange, categoriesChange, refreshList } = useSearchParame()
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
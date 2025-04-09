<template>
    <div class="h-full">
        <el-scrollbar @scroll="wallpaperListScroll" ref="wallpaperListScrollRef">
            <div ref="wallpaperListRef"
                class="h-full grid p-4 gap-3 justify-items-center grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 overflow-auto">
                <div class="w-75 h-50 bg-sky-400 rounded-md" v-for="item in wallpaperList.images" :key="item.imgSrc">
                    <Card :image="item"/>
                </div>
            </div>
            <div class="flex justify-center pb-3">
                <div v-show="loading"><i-ep-loading class="text-2xl motion-safe:animate-spin" /></div>
                <div class="cursor-pointer" @click="reloadingFn" v-show="reloading">加载失败，点击重试</div>
            </div>
            <p v-if="noMore">No more</p>
        </el-scrollbar>
    </div>
</template>
<script setup>
import { ref, computed, reactive } from 'vue'
import { getWallhavenList } from '../api/wallhaven'
const wallpaperList = reactive({
    images: [],
    page: 1,
    total: 2
})

getWallpaperList()
//获取壁纸列表
async function getWallpaperList(page) {
    try {
        const list = await getWallhavenList({ page })
        console.log(list)
        wallpaperList.images.push(...list.images)
        wallpaperList.total = list.page.total || 2
        console.log(list.page.current)
        wallpaperList.page = list.page.current
        loading.value = false
        if (reloading.value) reloading.value = false
    }
    catch (error) {
        //请求失败，出现重新加载按钮
        loading.value = false
        reloading.value = true
    }
}

// 监听滚动事件，判断是否需要加载更多数据
const loading = ref(false)
const reloading = ref(false)
const noMore = computed(() => wallpaperList.total === wallpaperList.page && !loading.value && !reloading.value)
//滚动容器
const wallpaperListScrollRef = ref(null)
//滚动列表
const wallpaperListRef = ref(null)
function wallpaperListScroll(e) {
    const ListHeight = wallpaperListRef.value.scrollHeight
    const scrollTop = e.scrollTop
    const clientHeight = wallpaperListScrollRef.value.wrapRef.clientHeight
    if ((clientHeight + scrollTop) >= ListHeight) {
        const isNoLoad = loading.value || noMore.value || reloading.value
        if (isNoLoad) return
        loading.value = true
        wallpaperList.page += 1
        getWallpaperList(wallpaperList.page)
    }
}

function reloadingFn() {
    loading.value = true
    reloading.value = false
    getWallpaperList(wallpaperList.page)
}

</script>
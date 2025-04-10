import { computed, reactive, ref } from 'vue'
import { getWallhavenList } from '../api/wallhaven'

export default ({ wallpaperListScrollRef, wallpaperListRef, params }) => {
    const wallpaperList = reactive({
        images: [],
        page: 1,
        total: 2
    })
    // init({ page: 1 })
    // 监听滚动事件，判断是否需要加载更多数据
    const loading = ref(false)
    const reloading = ref(false)
    const noMore = computed(() => wallpaperList.total === wallpaperList.page && !loading.value && !reloading.value)

    //获取壁纸列表
    async function getWallpaperList() {
        console.log(wallpaperList.page)
        params.page = wallpaperList.page
        try {
            const list = await getWallhavenList(params)
            wallpaperList.images.push(...list.images)
            wallpaperList.total = list.page.total || 2
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

    function wallpaperListScroll(e) {
        const ListHeight = wallpaperListRef.value.scrollHeight
        const scrollTop = e.scrollTop
        const clientHeight = wallpaperListScrollRef.value.wrapRef.clientHeight
        if ((clientHeight + scrollTop) >= ListHeight - 200) {
            const isNoLoad = loading.value || noMore.value || reloading.value
            if (isNoLoad) return
            loading.value = true
            console.log('loading',loading)
            wallpaperList.page += 1
            getWallpaperList(params)
        }
    }

    function init() {
        wallpaperList.page = 1
        wallpaperList.images = []
        getWallpaperList(params)
    }
    //重新加载列表
    function reloadingFn() {
        loading.value = true
        reloading.value = false
        getWallpaperList(params)
    }
    return { init, wallpaperList, loading, reloading, noMore, wallpaperListScroll, getWallpaperList, reloadingFn }
}
import MyElMessage from '../common/MyElMessage'
import { ref, computed, toRaw } from 'vue'
import useSettingStore from '@renderer/store/setting'
import { isUpdateImageLocal, isUpdateVideoLocal } from '@renderer/composables/useLocalList'
import { isUpdateImageFavorites } from '@renderer/composables/useFavoriteList'

export default ({data, page}) => {
    const { savePath } = useSettingStore()
    const isLoading = ref(false)
    const isDel = ref(false)
    const isFavorite = ref(false)

    // 卡片显示的封面图片链接
    const cardImageSrc = computed(() => {
        if(page === 'image' || page === 'imageFavorites' || page === 'imageLocal'){
            return data.smallSrc
        } else if(page === 'video' || page === 'videoLocal') {
            return data.cover
        }
    })
    const pageOptions = {
        image: {
            downloadFn: downloadImage,
            useWallpaperFn: useImageWallpaper,
            updateLocalMark: isUpdateImageLocal,
            updateFavoriteMark: isUpdateImageFavorites,
            addFavoritesFn: () => window.electronAPI.addImageFavorite(toRaw(data)),
            delFavoritesFn: () => window.electronAPI.delImageFavorite(toRaw(data)),
            getFavoriteStatusFn: () => window.electronAPI.getImageFavoriteStatus(toRaw(data)),
        },
        video: {
            downloadFn: downloadVideo,
            updateLocalMark: isUpdateVideoLocal
        },
        videoLocal: {
            downloadFn: downloadVideo,
            deleteApi: window.electronAPI.delLocalVideo,
            updateLocalMark: isUpdateVideoLocal
        }
    }
    pageOptions.imageLocal = { ...pageOptions.image, deleteApi: window.electronAPI.delLocalImage }
    pageOptions.imageFavorites = { ...pageOptions.image, getFavoriteStatusFn: null }
    // 获取初始收藏状态
    pageOptions[page].getFavoriteStatusFn && pageOptions[page].getFavoriteStatusFn().then(res=>{
        if(res.success && res.data) {
            isFavorite.value = true
        }
    })
    // 下载壁纸
    async function downloadWallpaper() {
        isLoading.value = true
        const res = await pageOptions[page].downloadFn()
        isLoading.value = false
        MyElMessage({
            message: res.message,
            type: res.success ? 'success' : 'error',
        })
        return res
    }
    // 下载图片壁纸
    async function downloadImage() {
        const res = await window.electronAPI.downloadImage({...data, imageSavePath: savePath.image})
        page !== 'imageLocal' && res.success && !res.exists && (pageOptions[page].updateLocalMark.value = true)
        return res
    }
    // 下载视频壁纸
    async function downloadVideo() {
        const res = await window.electronAPI.downloadVideo({...data, videoSavePath: savePath.video})
        page !== 'videoLocal' && res.success && !res.exists && (pageOptions[page].updateLocalMark.value = true)
        return res
    }
    // 设置为壁纸
    async function setWallpaper() {
        isLoading.value = true
        const res = await pageOptions[page].downloadFn()
        if (!res.success) {
            MyElMessage({
                message: res.message,
                type: 'error',
            })
            isLoading.value = false
            return
        }

        await pageOptions[page].useWallpaperFn(res.savePath)
        isLoading.value = false
    }
    // 设置图片壁纸
    async function useImageWallpaper(imagePath) {
        const useResult = await window.electronAPI.useWallpaper(imagePath)
        MyElMessage({
            message: useResult.message,
            type: useResult.success ? 'success' : 'error',
        })
    }
    async function delLocalWallpaper() {
        if(isDel.value) return
        const delResult = await pageOptions[page].deleteApi(toRaw(data))
        if(delResult.success) {
            isDel.value = true
            setTimeout(() => pageOptions[page].updateLocalMark.value = true, 400);
        }
        MyElMessage({
            message: delResult.message,
            type: delResult.success ? 'success' : 'error',
        })
    }
    
    let allowClick = true
    async function changeFavoritesStatus() {
        if(!allowClick) return
        allowClick = false

        let res;
        if (isFavorite.value) {
            res = await pageOptions[page].delFavoritesFn()
        } else {
            res = await pageOptions[page].addFavoritesFn()
        }
        if(!res.success) {
            return MyElMessage({ message: res.message, type: 'error' })
        }
        pageOptions[page].updateFavoriteMark.value = true
        allowClick = true
        isFavorite.value = !isFavorite.value
    }

    async function delFavoritesImage() {
        if(!allowClick) return
        allowClick = false

        const res = await pageOptions[page].delFavoritesFn()
        if(!res.success) {
            return MyElMessage({ message: res.message, type: 'error' })
        }
        isDel.value = true
        setTimeout(() => pageOptions[page].updateFavoriteMark.value = true, 400);
    }

    return { isLoading, isFavorite, isDel, cardImageSrc, pageOptions, downloadWallpaper, setWallpaper, delLocalWallpaper, changeFavoritesStatus, delFavoritesImage }
}

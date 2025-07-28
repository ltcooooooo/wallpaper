import MyElMessage from '../common/MyElMessage'
import { ref, computed, toRaw } from 'vue'
import useSettingStore from '@renderer/store/setting'
import useFavoritesStore from '@renderer/store/favorites'

export default (image, emit) => {
    const { favoritesList, addFavoritesImage, delFavoritesImage } = useFavoritesStore()
    const { setting } = useSettingStore()
    const isLoading = ref(false)
    const isDel = ref(false)
    const isFavorite = computed(() => !!favoritesList.find(i => i.imgSrc === image.imgSrc))
    async function downloadWallpaper() {
        isLoading.value = true
        const downloadResult = await window.electronAPI.downloadWallpaper(image.imgSrc, setting.wallpaperSavePath)
        isLoading.value = false
        MyElMessage({
            message: downloadResult.message,
            type: downloadResult.success ? 'success' : 'error',
        })

    }
    async function setWallpaper({ isLocalPage }) {
        isLoading.value = true
        let downloadResult
        if (!isLocalPage) {
            downloadResult = await window.electronAPI.downloadWallpaper(image.imgSrc, setting.wallpaperSavePath)
            if (!downloadResult.success) {
                console.log('downloadResult', downloadResult.success)
                MyElMessage({
                    message: downloadResult.message,
                    type: 'error',
                })
                isLoading.value = false
                return
            }
        }
        const useResult = await window.electronAPI.useWallpaper(isLocalPage ? image.imgSrc : downloadResult.filePath)
        isLoading.value = false
        MyElMessage({
            message: useResult.message,
            type: useResult.success ? 'success' : 'error',
        })

    }

    async function delLocalWallpaper() {
        console.log('image.imgSrc', image.imgSrc)
        const delResult = await window.electronAPI.delLocalWallpaper(image.imgSrc)
        if(delResult.success) {
            isDel.value = true
            emit('delWallpaper', image.imgSrc)
        }
        MyElMessage({
            message: delResult.message,
            type: delResult.success ? 'success' : 'error',
        })
    }

    function addFavorites(image) {
        addFavoritesImage(image)
    }
    function delFavorites(image, isFavoritePage) {
        if (isFavoritePage) {
            isDel.value = true
            setTimeout(() => delFavoritesImage(image), 400);
        } else {
            delFavoritesImage(image)
        }
    }
    return { isLoading, isFavorite, isDel, downloadWallpaper, setWallpaper, delLocalWallpaper, addFavorites, delFavorites }
}

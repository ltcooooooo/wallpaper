import MyElMessage from '../common/MyElMessage'
import { ref, computed, toRaw } from 'vue'
import useSettingStore from '@renderer/store/setting'
import useFavoritesStore from '@renderer/store/favorites'

export default ({data, emit, page}) => {
    const { favoritesList, addFavoritesImage, delFavoritesImage } = useFavoritesStore()
    const { setting, savePath } = useSettingStore()
    const isLoading = ref(false)
    const isDel = ref(false)
    const isFavorite = computed(() => !!favoritesList.find(i => i.imgSrc === data.imgSrc))
    console.log(page)
    const cardImageSrc = computed(() => {
        console.log('page', page)
        if(page === 'image' || page === 'imageFavorites' || page === 'imageLocal'){
            return data.smallSrc
        } else if(page === 'video') {
            return data.cover
        }
    })
    const pageOptions = {
        image: {
            downloadFn: window.electronAPI.downloadWallpaper,
            downloadUrl: data.imgSrc,
            downloadSavePath: savePath.image
        },
        video: {
            downloadFn: window.electronAPI.downloadWallpaper,
            downloadUrl: data.url,
            downloadSavePath: savePath.video
        }
    }
    async function downloadWallpaper() {
        console.log('page', page)
        isLoading.value = true
        const downloadFn = pageOptions[page].downloadFn
        const downloadUrl = pageOptions[page].downloadUrl
        const downloadSavePath = pageOptions[page].downloadSavePath
        console.log('downloadUrl', downloadUrl)
        console.log('downloadSavePath', downloadSavePath)
        // return
        const downloadResult = await downloadFn(downloadUrl, downloadSavePath)
        isLoading.value = false
        MyElMessage({
            message: downloadResult.message,
            type: downloadResult.success ? 'success' : 'error',
        })
    }
    async function setWallpaper() {
        const isLocalPage = page ==='imageLocal'
        console.log('isLocalPage', isLocalPage)
        isLoading.value = true
        let downloadResult
        if (!isLocalPage) {
            downloadResult = await window.electronAPI.downloadWallpaper(data.imgSrc, savePath.image)
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
        const useResult = await window.electronAPI.useWallpaper(isLocalPage ? data.imgSrc : downloadResult.filePath)
        isLoading.value = false
        MyElMessage({
            message: useResult.message,
            type: useResult.success ? 'success' : 'error',
        })

    }

    async function delLocalWallpaper() {
        console.log('image.imgSrc', data.imgSrc)
        const delResult = await window.electronAPI.delLocalWallpaper(data.imgSrc)
        if(delResult.success) {
            isDel.value = true
        }
        MyElMessage({
            message: delResult.message,
            type: delResult.success ? 'success' : 'error',
        })
    }

    function addFavorites() {
        addFavoritesImage(data)
    }
    function delFavorites() {
        if (page === 'imageFavorites') {
            isDel.value = true
            setTimeout(() => delFavoritesImage(data), 400);
        } else {
            delFavoritesImage(data)
        }
    }
    return { isLoading, isFavorite, isDel, cardImageSrc, downloadWallpaper, setWallpaper, delLocalWallpaper, addFavorites, delFavorites }
}

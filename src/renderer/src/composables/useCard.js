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
            downloadFn: window.electronAPI.downloadImage,
            downloadSavePath: savePath.image
        },
        video: {
            downloadFn: window.electronAPI.downloadWallpaper,
            downloadSavePath: savePath.video
        }
    }
    async function downloadWallpaper() {
        isLoading.value = true
        const downloadFn = pageOptions[page].downloadFn
        const downloadSavePath = pageOptions[page].downloadSavePath
        const downloadResult = await downloadFn({
            ...data,
            downloadSavePath
        })
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
            const downloadFn = pageOptions[page].downloadFn
            const downloadSavePath = pageOptions[page].downloadSavePath
            downloadResult = await downloadFn({
                ...data,
                downloadSavePath
            })
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
        const useResult = await window.electronAPI.useWallpaper(isLocalPage ? data.savePath : downloadResult.savePath)
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

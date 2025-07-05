import MyElMessage from '../common/MyElMessage'
import { ref } from 'vue'
import useSettingStore from '@renderer/store/setting'

export default (image, emit) => {
    const isLoading = ref(false)
    const isDel = ref(false)
    const { setting } = useSettingStore()
    async function downloadWallpaper() {
        console.log('downloadWallpaper', setting.wallpaperSavePath)
        isLoading.value = true
        const downloadResult = await window.electronAPI.downloadWallpaper(image.imgSrc, setting.wallpaperSavePath)
        isLoading.value = false
        MyElMessage({
            message: downloadResult.message,
            type: downloadResult.success ? 'success' : 'error',
        })

    }
    async function setWallpaper({ isLocal }) {
        isLoading.value = true
        let downloadResult
        if (!isLocal) {
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
        const useResult = await window.electronAPI.useWallpaper(isLocal ? image.imgSrc : downloadResult.filePath)
        isLoading.value = false
        MyElMessage({
            message: useResult.message,
            type: useResult.success ? 'success' : 'error',
        })

    }

    async function delLocalWallpaper() {
        isDel.value = true
        const delResult = await window.electronAPI.delLocalWallpaper(image.imgSrc)
        delResult.success && emit('delWallpaper', image.imgSrc)
        MyElMessage({
            message: delResult.message,
            type: delResult.success ? 'success' : 'error',
        })
    }
    return { isLoading, isDel, downloadWallpaper, setWallpaper, delLocalWallpaper }
}
import MyElMessage from '../common/MyElMessage'
import { ref } from 'vue'
import useSettingStore from '@renderer/store/setting'
export default (image) => {
    const isLoading = ref(false)
    const { setting } = useSettingStore()
    async function downloadWallpaper() {
        console.log('downloadWallpaper',setting.wallpaperSavePath)
        isLoading.value = true
        try {
            const downloadResult = await window.electronAPI.downloadWallpaper(image.imgSrc, setting.wallpaperSavePath)
            isLoading.value = false
            MyElMessage({
                message: downloadResult.message,
                type: 'success',
            })
        }catch (error) {
            isLoading.value = false
            ElMessage({
                message: error.message,
                type: 'error',
            })
        }
        
    }
    async function setWallpaper() {
        isLoading.value = true
        try {
            const downloadResult = await window.electronAPI.useWallpaper(image.imgSrc, setting.wallpaperSavePath)
            isLoading.value = false
            MyElMessage({
                message: downloadResult.message,
                type: 'success',
            })
        }catch (error) {
            isLoading.value = false
            ElMessage({
                message: error.message,
                type: 'error',
            })
        }
        
    }
    return {isLoading, downloadWallpaper, setWallpaper }
}
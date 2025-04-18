import MyElMessage from '../common/MyElMessage'
import { ref } from 'vue'
export default (image) => {
    const isLoading = ref(false)
    console.log(image)
    function setWallpaper() {
        // window.electronAPI
    }
    async function downloadWallpaper() {
        isLoading.value = true
        try {
            const downloadResult = await window.electronAPI.downloadWallpaper(image.imgSrc, 'D:\\Users\\w9038143\\Pictures')
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
            const downloadResult = await window.electronAPI.useWallpaper(image.imgSrc, 'D:\\Users\\w9038143\\Pictures')
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
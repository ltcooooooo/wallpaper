import { ref } from 'vue'

export default function useUpdate() {
    const findUpdate = ref(false)
    const updateStatus = ref('wait')
    const tipText = ref('有新版本了！单机更新，双击取消')
    let updateInfo = null
    window.electronAPI.findUpdater((value) => {
        findUpdate.value = true
        updateInfo = value
    })
    window.electronAPI.updateProgress((value) => {
        const { percent } = value
        tipText.value = `${Math.floor(percent)}%`
    })
    window.electronAPI.updateError(() => {
        updateStatus.value = 'error'
        tipText.value = '下载失败了，点击重试'
    })
    window.electronAPI.updateDownloaded(() => {
        updateStatus.value = 'downloaded'
        tipText.value = '下载完成，点击安装更新'
    })


    function updateChange(){
        if(updateStatus.value === 'wait' || updateStatus.value === 'error') {
            updateStatus.value = 'updateing'
            tipText.value = '0%'
            window.electronAPI.startUpdateApp()
        }
        if(updateStatus.value === 'downloaded') {
            window.electronAPI.quitAndInstall()
        }
    }

    function cancelUpdate() {
        findUpdate.value = false
        updateStatus.value = 'cancel'
    }
    return {
        findUpdate,
        updateStatus,
        tipText,
        updateChange,
        cancelUpdate
    }
}
import { ref } from 'vue'

export default function useUpdate() {
    const findUpdate = ref(false)
    let updateInfo = null
    window.electronAPI.findUpdater((value) => {
        findUpdate.value = true
        updateInfo = value
        console.log('update', value)
    })
}
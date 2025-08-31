import { defineStore } from 'pinia'
import { ref, toRaw, watch, computed } from 'vue'
import initCursor from '@renderer/utils/cursorEffects/initCursor'

const useSettingStore = defineStore('setting', () => {
    const setting = ref({})

    async function initSetting() {
        const settingConfig = await window.electronAPI.getSettingConfig()
        initCursor(settingConfig)
        setting.value = settingConfig
        watch(setting.value, (newVal, oldVal) => {
            window.electronAPI.setSettingConfig(toRaw(setting.value))
        }, { immediate: true })
    }
    const savePath = computed(()=>{
        return {
            image: setting.value.dataPath + '/images',
            video: setting.value.dataPath + '/videos'
        }
    } )
    return {
        setting,
        savePath,
        initSetting
    }
})
export default useSettingStore 
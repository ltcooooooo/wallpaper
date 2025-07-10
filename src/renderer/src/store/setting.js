import { defineStore } from 'pinia'
import { reactive } from 'vue'
const useSettingStore = defineStore('setting', () => {
    const setting = reactive({})

    function setSetting(settingsVal) {
        for (const key in settingsVal) {
            setting[key] = settingsVal[key]
        }
        window.electronAPI.setSettingConfig({...setting})
    }

    async function initSetting() {
        const settingConfig = await window.electronAPI.getSettingConfig()
        for (const key in settingConfig) {
            setting[key] = settingConfig[key]
        }
    }
    return {
        setting,
        setSetting,
        initSetting
    }
})
export default useSettingStore 
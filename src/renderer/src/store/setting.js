import { defineStore } from 'pinia'
import { ref, toRaw, watch } from 'vue'
import initCursor from '@renderer/utils/cursorEffects/initCursor'

const useSettingStore = defineStore('setting', () => {
    const setting = ref({})

    async function initSetting() {
        const settingConfig = await window.electronAPI.getSettingConfig()
        console.log('settingConfig', settingConfig)
        initCursor(settingConfig)
        setting.value = settingConfig
        watch(setting.value, (newVal, oldVal) => {
            console.log('更新setting')
            const raw = toRaw(setting.value)
            window.electronAPI.setSettingConfig(raw)
        })
    }
    return {
        setting,
        initSetting
    }
})
export default useSettingStore 
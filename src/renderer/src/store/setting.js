import { defineStore } from 'pinia'
import { reactive, toRaw , watch} from 'vue'
// import initCursor from '@renderer/utils/cursorEffects/initSursor.js'
import initCursor from '@renderer/utils/cursorEffects/initSursor'

// src/renderer/src/utils/cursorEffects/initSursor.js

const useSettingStore = defineStore('setting', () => {
    const setting = reactive({})
    
    function setSetting(settingsVal) {
        for (const key in settingsVal) {
            setting[key] = settingsVal[key]
        }
    }
    
    async function initSetting() {
        const settingConfig = await window.electronAPI.getSettingConfig()
        console.log('settingConfig', settingConfig)
        initCursor(settingConfig)
        setSetting(settingConfig)
    }
    watch(setting,(newVal,oldVal)=>{
        // console.log('setting change',newVal,oldVal)
        const raw = toRaw(setting)
        window.electronAPI.setSettingConfig(raw)
    })
    return {
        setting,
        setSetting,
        initSetting
    }
})
export default useSettingStore 
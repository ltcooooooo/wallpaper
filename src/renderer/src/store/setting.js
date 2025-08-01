import { defineStore } from 'pinia'
import { reactive, toRaw , watch} from 'vue'
import initCursor from '@renderer/utils/cursorEffects/initCursor'

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
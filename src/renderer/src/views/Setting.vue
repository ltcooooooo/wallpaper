<template>
    <div id="app-setting" class="p-2 flex flex-col gap-1 text-sm">
        <div class="flex items-center">
            <span class="text-right" :style="{width: labelWidth}">开机自启：</span>
            <el-switch
              v-model="setting.autoStart"
              @change="autoStartChange"
            ></el-switch>
        </div>
        <div class="flex items-center">
            <span class="text-right" :style="{width: labelWidth}">壁纸保存位置：</span>
            <u class="text-blue-500 cursor-pointer overflow-hidden text-ellipsis flex-1" :title="setting.wallpaperSavePath" @click="setSavePath">{{ setting.wallpaperSavePath }}</u>
        </div>
    </div>
</template>
<script setup>
import useSettingStore from '@renderer/store/setting'
const { setting } = useSettingStore()

const labelWidth = `${106}px`

const setSavePath = async () => {
   const result = await window.electronAPI.setSavePath()
   const filePath = result.filePaths[0] || false
   if( filePath ) {
    setting.wallpaperSavePath = filePath
   }
}

function autoStartChange() {
    window.electronAPI.changeTrayStatus({name: '开机自启动', status: setting.autoStart})
}
</script>
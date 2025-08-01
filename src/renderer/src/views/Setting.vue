<template>
    <div id="app-setting" class="p-2">
        <div class="flex">
            <span class="w-fit">壁纸保存位置：</span>
            <u class="text-blue-500 cursor-pointer overflow-hidden text-ellipsis flex-1" :title="setting.wallpaperSavePath" @click="setSavePath">{{ setting.wallpaperSavePath }}</u>
        </div>
    </div>
</template>
<script setup>
import useSettingStore from '@renderer/store/setting'
const { setting, setSetting } = useSettingStore()

const setSavePath = async () => {
   const result = await window.electronAPI.setSavePath()
   const filePath = result.filePaths[0] || false
   if( filePath ) {
    setSetting({ wallpaperSavePath: filePath })
   }
}
</script>
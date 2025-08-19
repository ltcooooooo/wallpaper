<template>
  <div id="wallpaper">
    <Title v-if="showTitle"/>
    <main class="w-screen h-[calc(100vh-32px)]">
      <RouterView v-slot="{ Component }">
        <keep-alive>
          <component :is="Component" :key="route.name" />
        </keep-alive>
      </RouterView>
    </main>
  </div>
</template>
<script setup>
import { useRoute } from 'vue-router';
import useIpc from  '@renderer/composables/useIpc';
const route = useRoute();
const isCursorWindow = (/\/cursorWindow$/.test(location.hash));
const showTitle = !isCursorWindow;
useIpc()

// 修复windows下右边框消失
const isWin = window.electron.process.platform === 'win32'

if(isWin) setWinAppWidth()
function setWinAppWidth(){
  const app = document.querySelector('#app')
  app.style.width = 'calc(100vw - 2px)'
}
</script>

<style>
.l-color-picker .el-color-dropdown__btns .el-color-dropdown__link-btn{
  display: none;
}
.emoji-picker.el-popover.el-popper {
  padding: 0;
}
</style>

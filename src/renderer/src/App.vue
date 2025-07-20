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
const route = useRoute();
const showTitle = !(/\/cursorWindow$/.test(location.hash));
</script>

<style>
.l-color-picker .el-color-dropdown__btns .el-color-dropdown__link-btn{
  display: none;
}
.emoji-picker.el-popover.el-popper {
  padding: 0;
}
</style>

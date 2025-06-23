<template>
  <div id="wallpaper">
    <Title />
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
</script>

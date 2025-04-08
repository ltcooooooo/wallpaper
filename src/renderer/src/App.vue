<template>
  <div id="wallpaper">
    <Title />
    <keep-alive>
      <RouterView v-if="$route.meta.keepAlive" />
    </keep-alive>
  </div>
</template>


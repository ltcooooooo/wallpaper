<template>
  <div id="wallpaper">
    <Title />
    <main class="w-screen h-[calc(100vh-32px)]">
      <RouterView v-slot="{ Component }">
        <keep-alive>
          <component :is="Component" v-if="$route.meta.keepAlive" />
        </keep-alive>
      </RouterView>
    </main>
  </div>
</template>

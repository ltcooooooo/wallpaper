<template>
  <div id="FavoritesWallpaper" class="h-full">
    <el-scrollbar>
      <div class="h-full flex flex-wrap justify-center p-4 gap-3 overflow-auto">
        <div
          class="w-75 h-50 rounded-md overflow-hidden shadow-xl transition-all hover:shadow-2xl hover:translate-y-[-2px]"
          v-for="item in favoritesList"
          :key="item.imgSrc"
        >
          <Card :image="item" page="favorites"/>
        </div>
      </div>
    </el-scrollbar>
  </div>
</template>

<script setup>
import useFavoritesStore from '@renderer/store/favorites'
const { favoritesList } = useFavoritesStore()
</script>

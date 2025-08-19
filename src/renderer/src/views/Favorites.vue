<template>
  <div id="FavoritesWallpaper" class="h-full">
    <el-scrollbar>
      <div class="h-full flex flex-wrap justify-center p-4 gap-3 overflow-auto">
        <div
          class="w-75 h-50 rounded-md overflow-hidden shadow-xl transition-all hover:shadow-2xl hover:translate-y-[-2px]"
          v-for="item in favoritesList"
          :key="item.imgSrc"
        >
          <Card :data="item" type="image" page="imageFavorites" v-slot="CD" >
            <section
              class="absolute bottom-0 left-0 bg-[rgba(0,0,0,.4)] text-xs flex items-center justify-between px-3 w-full h-9 translate-y-[100%]  group-hover:translate-y-0 transition">
              <div class="text-white">{{ item.size }}</div>
              <div class="text-white">
                  <my-tooltip v-if="!CD.isFavorite" content="收藏">
                      <el-button type="warning" size="small" @click="CD.addFavorites"><i-ms-kid-star-outline /></el-button>
                  </my-tooltip>
                  <my-tooltip v-if="CD.isFavorite" content="取消收藏">
                      <el-button type="warning" size="small" @click="CD.delFavorites"><i-ms-kid-star /></el-button>
                  </my-tooltip>
                  <my-tooltip content="下载">
                      <el-button type="success" size="small" @click="CD.downloadWallpaper" :loading="CD.isLoading"><i-ms-download-rounded v-show="!CD.isLoading" /></el-button>
                  </my-tooltip>
                  <my-tooltip content="设为壁纸">
                      <el-button type="primary" size="small" @click="CD.setWallpaper" :loading="CD.isLoading"><i-ms-desktop-mac v-show="!CD.isLoading" /></el-button>
                  </my-tooltip>
              </div>
            </section>
          </Card>
        </div>
      </div>
    </el-scrollbar>
  </div>
</template>

<script setup>
import useFavoritesStore from '@renderer/store/favorites'
const { favoritesList } = useFavoritesStore()
</script>

<template>
  <div class="h-full flex flex-col">
    <section class="flex-1 w-full min-h-0 pt-4">
      <list :loadMore="loadMore">
        <div
          class="w-75 h-50 rounded-md overflow-hidden shadow-xl transition-all hover:shadow-2xl hover:translate-y-[-2px]"
          v-for="item in wallpaperList"
          :key="item.url"
        >
          <Card :data="item" type="video" page="video" v-slot="CD" >
            <section
              class="absolute bottom-0 left-0 bg-[rgba(0,0,0,.4)] text-xs flex items-center justify-between px-3 w-full h-9 translate-y-[100%]  group-hover:translate-y-0 transition">
              <div class="text-white">{{ filesize(item.size) }}</div>
              <div class="text-white">
                  <my-tooltip v-if="!CD.isFavorite" content="收藏">
                      <el-button type="warning" size="small" @click="CD.changeFavoritesStatus"><i-ms-kid-star-outline /></el-button>
                  </my-tooltip>
                  <my-tooltip v-if="CD.isFavorite" content="取消收藏">
                      <el-button type="warning" size="small" @click="CD.changeFavoritesStatus"><i-ms-kid-star /></el-button>
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
      </list>
    </section>
  </div>
</template>
<script setup>
import { reactive, computed } from "vue";
import { getVideoList } from "../api/video";
import { filesize } from "filesize";

const wallpaperList = reactive([]);
const params = reactive({
  page: 1,
  pageSize: 12,
})

const loadMore = reactive({
  scrollLoad: true,
  loading: false,
  reLoading: false,
  noMore: computed(
    () => params.total === params.page && !loadMore.loading && !loadMore.reLoading
  ),
  scrollLoadFn: () => {
    if (loadMore.loading || loadMore.noMore || loadMore.reLoading) return;
    params.page++;
    getWallpaperList();
  },
  reloadingFn: () => {
    loadMore.reLoading = false;
    loadMore.loading = true;
    getWallpaperList();
  },
});

async function getWallpaperList() {
  loadMore.loading = true;
  // params.page = page.current;
  try {
    const { videos, total } = await getVideoList(params);
    params.total = Math.ceil(total / params.pageSize);
    wallpaperList.push(...videos);
    loadMore.loading = false;
    if (loadMore.reLoading) reLoading = false;
  } catch (error) {
    //请求失败，出现重新加载按钮
    loadMore.loading = false;
    loadMore.reLoading = true;
  }
}

function init() {
  params.page= 1;
  wallpaperList.length = 0;
  getWallpaperList(params);
}
init();
</script>

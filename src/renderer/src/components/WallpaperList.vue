<template>
  <div class="h-full flex flex-col">
    <wallpaper-search :init="init" />
    <section class="flex-1 w-full min-h-0">
      <list :loadMore="loadMore" :data="wallpaperList">
        <div
          class="w-75 h-50 rounded-md overflow-hidden shadow-xl transition-all hover:shadow-2xl hover:translate-y-[-2px]"
          v-for="item in wallpaperList"
          :key="item.imgSrc"
        >
          <Card :data="item" type="image" page="image" v-slot="CD" >
            <section
              class="absolute bottom-0 left-0 bg-[rgba(0,0,0,.4)] text-xs flex items-center justify-between px-3 w-full h-9 translate-y-[100%]  group-hover:translate-y-0 transition">
              <div class="text-white">{{ item.size }}</div>
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
import useSearchParame from "../composables/useSearchParame";
import { getWallhavenList } from "@renderer/api/wallhaven";

const { params } = useSearchParame();

const wallpaperList = reactive([]);
const page = reactive({
  current: 1,
  total: 2,
});

const loadMore = reactive({
  scrollLoad: true,
  loading: false,
  reLoading: false,
  noMore: computed(
    () => page.total === page.current && !loadMore.loading && !loadMore.reLoading
  ),
  scrollLoadFn: () => {
    if (loadMore.loading || loadMore.noMore || loadMore.reLoading) return;
    page.current++;
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
  params.page = page.current;
  try {
    const { images, page: pageInfo } = await getWallhavenList(params);
    const { total, current } = pageInfo;
    wallpaperList.push(...images);
    page.total = total || 2;
    page.current = current;
    loadMore.loading = false;
    if (loadMore.reLoading) reLoading = false;
  } catch (error) {
    //请求失败，出现重新加载按钮
    loadMore.loading = false;
    loadMore.reLoading = true;
  }
}

function init() {
  page.current = 1;
  wallpaperList.length = 0;
  getWallpaperList(params);
}
init();
</script>

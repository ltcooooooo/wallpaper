<template>
  <div class="h-full w-full pt-4 flex flex-col">
    <section class="flex-1 min-h-0">
      <list ref="listRef" :noData="!imageList.length">
        <div
          class="w-75 h-50 rounded-md overflow-hidden shadow-xl transition-all hover:shadow-2xl hover:translate-y-[-2px]"
          v-for="item in imageList"
          :key="item.id"
        >
          <Card :data="item" type="image" page="imageLocal" v-slot="CD">
            <section
              class="absolute bottom-0 left-0 bg-[rgba(0,0,0,.4)] text-xs flex items-center justify-between px-3 w-full h-9 translate-y-[100%] group-hover:translate-y-0 transition"
            >
              <div class="text-white">{{ item.size }}</div>
              <div class="text-white">
                <my-tooltip content="删除">
                  <el-button type="danger" size="small" @click="CD.delLocalWallpaper"
                    ><i-ms-delete-outline-rounded
                  /></el-button>
                </my-tooltip>
                <my-tooltip v-if="!CD.isFavorite" content="收藏">
                  <el-button type="warning" size="small" @click="CD.changeFavoritesStatus"
                    ><i-ms-kid-star-outline
                  /></el-button>
                </my-tooltip>
                <my-tooltip v-if="CD.isFavorite" content="取消收藏">
                  <el-button type="warning" size="small" @click="CD.changeFavoritesStatus"
                    ><i-ms-kid-star
                  /></el-button>
                </my-tooltip>
                <my-tooltip content="设为壁纸">
                  <el-button
                    type="primary"
                    size="small"
                    @click="CD.setWallpaper"
                    :loading="CD.isLoading"
                    ><i-ms-desktop-mac v-show="!CD.isLoading"
                  /></el-button>
                </my-tooltip>
              </div>
            </section>
          </Card>
        </div>
      </list>
    </section>
    <section class="py-4 flex justify-center" v-show="!paginationHide">
      <el-pagination
        background
        size="small"
        layout="prev, pager, next"
        :page-size="page.pageSize"
        :total="page.total"
        v-model:current-page="page.current"
        :hide-on-single-page="paginationHide"
        @change="pageChange"
      />
    </section>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useImageList } from "@renderer/composables/useLocalList";

const listRef = ref(null);
const { imageList, page, paginationHide, pageChange } = useImageList({ listRef });
</script>

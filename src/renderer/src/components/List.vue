<template>
  <el-scrollbar @end-reached="loadMore.scrollLoadFn">
    <div class="h-full flex flex-wrap justify-center p-4 pt-0 gap-3 overflow-auto">
      <slot/>
    </div>
    <div class="flex justify-center pb-4" v-if="loadMore.scrollLoad">
      <div v-show="loadMore.loading"><i-line-md-loading-twotone-loop class="text-2xl" /></div>
      <div
        class="cursor-pointer text-red-500 text-sm"
        @click="loadMore.reloadingFn"
        v-show="loadMore.reLoading"
      >
        加载失败了，点击重试
      </div>
      <div v-show="loadMore.noMore" class="text-sm text-center text-gray-600">
        没有更多了哦
      </div>
    </div>
  </el-scrollbar>
</template>

<script setup>
const { data, loadMore } = defineProps({
  loadMore: {
    type: Object,
    default: () => ({
      scrollLoad: false,
      loading: false,
      reLoading: false,
      noMore: false,
      scrollLoadFn: null,
      reloadingFn: null
    }),
  },
});
</script>

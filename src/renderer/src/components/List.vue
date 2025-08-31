<template>
  <el-scrollbar ref="scrollbarRef" @end-reached="loadMore.scrollLoadFn">
    <div class="h-full flex flex-wrap justify-center p-4 pt-0 gap-3 overflow-auto">
      <slot/>
      <div v-for="i in 3" class="w-75 h-0 overflow-hidden" />
    </div>
    <div class="flex justify-center text-sm" v-if="noData">暂时还没有数据哦，快去添加吧~</div>
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
import { ref } from "vue";
const scrollbarRef = ref(null);
const { noData, loadMore } = defineProps({
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
  noData: {
    type: Boolean,
    default: false,
  }
});

defineExpose({
  scrollToTop() {
      scrollbarRef.value?.scrollTo({ top: 0, behavior: "instant" });
  },
});
</script>

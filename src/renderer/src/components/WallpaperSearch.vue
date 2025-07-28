<template>
  <section
    class="bg-gray-000 py-2 h-12 grid grid-cols-4 items-center px-4 gap-2 gap-y-1 w-fit min-w-[556px] max-[556px]:grid-cols-2 max-[556px]:min-w-[320px] max-[556px]:h-18"
  >
    <el-select
      v-model="wallpaperFilter.value.categories"
      multiple
      size="small"
      style="width: 126px"
      @change="categoriesChange"
    >
      <el-option
        v-for="item in wallpaperFilter.options.categories"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-select>
    <el-select v-model="wallpaperFilter.value.sorting" size="small" style="width: 126px">
      <el-option
        v-for="item in wallpaperFilter.options.sorting"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-select>
    <el-select
      v-show="showTopRange"
      v-model="wallpaperFilter.value.topRange"
      size="small"
      style="width: 126px"
    >
      <el-option
        v-for="item in wallpaperFilter.options.topRange"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-select>
    <div class="flex">
      <el-button size="small" style="width: 34px" @click="refreshList"
        ><i-ep-refresh
      /></el-button>
      <div class="bg-yellow-500 flex-1 opacity-0" @click="changePurity">切换</div>
    </div>
  </section>
</template>

<script setup>
import useSearchParame from "../composables/useSearchParame";

const { init } = defineProps(["init"]);
const {
  wallpaperFilter,
  showTopRange,
  categoriesChange,
  refreshList,
  changePurity
} = useSearchParame(init);
</script>

<style scoped>
:deep(.el-tag__close) {
  display: none;
}

:deep(.el-select__suffix) {
  display: none;
}

:deep(.el-select__wrapper.is-focused) {
  box-shadow: none;
}
</style>

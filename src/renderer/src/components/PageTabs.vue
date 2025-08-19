<template>
  <div
    class="flex absolute top-1/2 left-0 translate-y-[-50%] h-40 z-9 pointer-events-none transition"
    :style="{ transform: show ? 'translateX(0)' : 'translateX(-100px)' }"
    ref="pageTabs"
  >
    <section
      class="w-[100px] box-border bg-white shadow-xl rounded-r-md pointer-events-auto"
    >
      <ul class="text-sm flex w-full p-3 flex-col text-center gap-2">
        <li
          v-for="item in tabOptions"
          :key="item.name"
          class="rounded-md py-1 cursor-pointer"
          :style="{ backgroundColor: item.active ? '#e5e7eb' : '' }"
          @click="emit('changeTab', item.name)"
        >
          {{ item.label }}
        </li>
      </ul>
    </section>
    <section class="flex items-center overflow-y-hidden pr-2">
      <div
        class="bg-white py-3 px-1 rounded-r-md text-sm shadow-xl cursor-pointer pointer-events-auto border border-gray-100 border-l-0"
        @click="handleClick"
      >
        <i-ep-arrow-right
          :style="{ transform: show ? 'rotate(180deg)' : 'rotate(0deg)' }"
        />
      </div>
    </section>
  </div>
</template>

<script setup>
import { useTabs } from "../composables/usePageTabs";
import { ref } from 'vue'

const emit = defineEmits(["changeTab"]);
const props = defineProps({
  tabOptions: {
    type: Array,
  },
});

const pageTabs = ref(null);

const { show, handleClick } = useTabs(pageTabs);
</script>

<style scope>
.shadow-xl {
    box-shadow: 0 0px 22px -5px var(--tw-shadow-color, rgb(0 0 0 / 0.1)), 0 8px 16px -6px var(--tw-shadow-color, rgb(0 0 0 / 0.1));
}
</style>

<template>
  <div class="options-group flex items-center gap-3">
    <template v-if="componentName === 'emoji'">
      <emoji-picker
        v-for="(emoji, index) in options"
        :emoji="emoji"
        @selectEmoji="selectEmoji($event, index)"
      />
    </template>
    <template v-if="componentName === 'colors'">
        <el-color-picker v-for="(color, index) in options" popper-class="l-color-picker" v-model="options[index]" />
    </template>
    <section class="btn-group" v-if="isEditable">
      <el-button type="success" @click="add" :disabled="addDisabled"><i-ms-add /></el-button>
      <el-button type="danger" @click="remove" :disabled="removeDisabled"><i-ms-remove-rounded /></el-button>
    </section>
  </div>
</template>

<script setup>
import useSettingStore from "@renderer/store/setting";
import { computed } from "vue";
const { setting } = useSettingStore();
const cursor = setting.cursor;

const { cursorTypeName, componentName, size, min, max } = defineProps({
  componentName: String,
  cursorTypeName: String,
  size: Number,
  min: Number,
  max: Number,
  isEditable: {
    type: Boolean,
    default: true
  }
});

const options = cursor.cursorType[cursorTypeName].options[componentName];
console.log('options', options);

const addDisabled = computed(() => {
    return options.length === max;
})

const removeDisabled = computed(() => {
  return options.length === min;
})

function selectEmoji(emoji, index) {
  options[index] = emoji.native;
}

function add() {
    options.push(options[options.length - 1]);
}
function remove() {
  options.pop();
}
</script>
<style>
.btn-group {
  button {
    aspect-ratio: 1;
    width: auto;
    padding: 0;
    transform: scale(0.9);
  }
}
</style>

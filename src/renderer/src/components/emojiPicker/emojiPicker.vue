<template>
    <el-popover :width="300" trigger="click" :hide-after="0" popper-class="emoji-picker" ref="emojiPicker">
      <template #reference>
        <div class="w-8 h-8 rounded-sm border border-gray-300 bg-white flex items-center justify-center cursor-pointer text-xl"> {{ emoji }}</div>
      </template>
        <picker height="200px" searchPosition="static" @changeEmoji="changeEmoji"/>
    </el-popover>
</template>
<script setup>
const { emoji } = defineProps(['emoji'])
const emit = defineEmits(['selectEmoji'])
import { ref } from 'vue'

const emojiPicker = ref(null)

function changeEmoji(emojiVlue) {
    emojiPicker.value.hide()
    emit('selectEmoji', emojiVlue)
}
</script>
<template>
    <div ref="emojiRef"></div>
</template>

<script setup>
import { Picker } from 'emoji-mart'
import data from '@emoji-mart/data'
import i18n from '@emoji-mart/data/i18n/zh.json'
import { onMounted, ref} from 'vue'

const emit = defineEmits(['changeEmoji'])

const props = defineProps({
    height: {
        type: String,
        default: '100%'
    },
    width: {
        type: String,
        default: '100%'
    },
    previewPosition: {
        type: String,
        default: 'none'
    },
    searchPosition: {
        type: String,
        default: 'none'
    },
    navPosition: {
        type: String,
        default: 'none'
    },
    theme: {
        type: String,
        default: 'light'
    },
    dynamicWidth: {
        type: Boolean,
        default: true
    }
})
const { height, width, previewPosition, searchPosition, navPosition, theme, dynamicWidth } = props
const pickerOptions = {
    data,
    i18n,
    previewPosition,
    searchPosition,
    navPosition,
    theme,
    dynamicWidth,
    onEmojiSelect,
    // onClickOutside
}
const emojiRef = ref(null)
onMounted(() =>{
    const picker = new Picker(pickerOptions)
    picker.style.height = height
    picker.style.width = width
    picker.style.minHeight = 0
    emojiRef.value.append(picker)
})
function onEmojiSelect(emoji) {
    emit('changeEmoji', emoji)
}
// function onClickOutside() {
//     console.log('click outside')
// }
</script>
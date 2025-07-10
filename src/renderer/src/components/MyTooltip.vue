<template>
    <el-tooltip :content="content" :placement="placement" effect="dark" :enterable="false" :hide-after="0" :show-after="200">
        <slot></slot>
    </el-tooltip>
</template>
<script setup>
const { content } = defineProps({
    content: {
        type: String,
        required: true
    },
    placement: {
        type: String,
        default: 'top'
    }
})
</script>
<template>
    <section class="card w-full h-full">
        <img :src="image.smallSrc" alt="">
    </section>
</template>
<script setup>
import { defineProps } from 'vue'
const { image } = defineProps(['image'])
console.log('image', image.smallSrc)
</script>
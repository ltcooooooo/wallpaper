<template>
    <div id="app-title"
        class="drag h-[32px] flex justify-between box-content bg-[#f0f4f9] border-b-[1px] border-b-[rgba(0,0,0,0.1)]">
        <div class="left flex items-center h-full">
            <div class="log px-2 h-full flex items-center">
                <img class="max-h-[70%]" src="../assets/image/icon24x24.png" alt="">
            </div>
            <el-text tag="b">wallpaper</el-text>
        </div>
        <div class="right no-drag flex gap-[10px]">
            <el-button-group class="relative">
                <el-button color="#f0f4f9"><i-ep-folder-opened /></el-button>
                <el-button color="#f0f4f9"><i-ep-star /></el-button>
                <div class="line absolute w-[0.5px] h-[50%] bg-[rgba(0,0,0,0.1)] right-[-5px] top-1/2 translate-[-50%]">
                </div>
            </el-button-group>
            <el-button-group>
                <el-button @click="minimizeApp" color="#f0f4f9"><i-ep-minus /></el-button>
                <el-button @click="quitApp" color="#f0f4f9"><i-ep-close /></el-button>
            </el-button-group>
        </div>
    </div>
</template>

<script setup>
//最小化App
const minimizeApp = () => window.api.minimize()
//关闭App
const quitApp = () => window.api.quit()
</script>
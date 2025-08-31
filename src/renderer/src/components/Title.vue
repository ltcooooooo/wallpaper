<template>
    <header id="app-title"
        class="drag h-[32px] flex justify-between box-content bg-[#f0f4f9] border-b-[1px] border-b-[rgba(0,0,0,0.1)]">
        <section class="left flex items-center h-full no-drag cursor-pointer" @click="toRouter('/')">
            <div class="pl-2 pr-1.5 h-full flex items-center">
                <img class="max-h-[70%]" src="../assets/image/icon24x24.png" alt="">
            </div>
            <el-text tag="b">wallpaper</el-text>
        </section>
        <section class="right no-drag flex gap-[20px]">
            <el-button-group class="relative">
                <my-tooltip :content="tipText" placement="bottom" v-if="findUpdate">
                    <el-button @click="updateChange" @dblclick="cancelUpdate" color="#f0f4f9">
                        <i-line-md-downloading v-if="updateStatus === 'wait'" class="text-red-500 animated animate-bounce" />
                        <i-line-md-downloading-loop v-if="updateStatus === 'updateing'" class="text-orange-500 animated" />
                        <i-line-md-confirm-circle v-if="updateStatus === 'downloaded'" class="text-green-500 animated" />
                        <i-line-md-alert-circle-loop v-if="updateStatus === 'error'" class="text-red-500 animated" />
                    </el-button>
                </my-tooltip>
                <my-tooltip content="光标效果" placement="bottom">
                    <el-button @click="toRouter('/cursor')" color="#f0f4f9" :class="{ active: isActive('/cursor')}"><i-solar-cursor-linear /></el-button>
                </my-tooltip>
                <my-tooltip content="我的收藏" placement="bottom">
                    <el-button @click="toRouter('/favorites')" color="#f0f4f9" :class="{ active: isActive('/favorites')}"><i-ms-kid-star-outline /></el-button>
                </my-tooltip>
                <my-tooltip content="我的壁纸" placement="bottom">
                    <el-button @click="toRouter('/local')" color="#f0f4f9":class="{ active: isActive('/local')}"><i-ep-folder-opened /></el-button>
                </my-tooltip>
                <my-tooltip content="设置" placement="bottom">
                    <el-button @click="toRouter('/setting')" color="#f0f4f9" :class="{ active: isActive('/setting')}"><i-ep-setting/></el-button>
                </my-tooltip>
                <div class="line absolute w-[0.5px] h-[50%] bg-[rgba(0,0,0,0.1)] right-[-10px] top-1/2 translate-[-50%]">
                </div>
            </el-button-group>
            <el-button-group>
                <my-tooltip content="最小化" placement="bottom">
                    <el-button @click="minimizeApp" color="#f0f4f9"><i-ep-minus /></el-button>
                </my-tooltip>
                <my-tooltip content="最小化到系统托盘" placement="bottom">
                    <el-button @click="quitApp" color="#f0f4f9"><i-ep-close /></el-button>
                </my-tooltip>
            </el-button-group>
        </section>
    </header>
</template>

<script setup>
import useUpdater from '@renderer/composables/useUpdater'
import { useRoute, useRouter } from 'vue-router'
import { ref } from 'vue'

const { updateStatus, findUpdate, tipText, updateChange, cancelUpdate } = useUpdater()

const route = useRoute()
const router = useRouter()

const currentRoute = ref(route.path)

const toRouter = (path) => {
    if(route.path !== path){
        router.push(path)
        currentRoute.value = path
    }
}

const isActive = (path) => {
    return route.path === path
}


//最小化App
const minimizeApp = () => window.electronAPI.minimize()
//关闭App
const quitApp = () => window.electronAPI.quit()

</script>

<style scoped>
.animate-bounce {
    animation: bounce 1s 1s infinite;
}

:deep(.el-button.active) {
    background-color: #d2dae2;
    border-color: #d2dae2;
    z-index:auto;
}
@keyframes bounce {
    0%, 20%, 53%, 100% {
        -webkit-animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
        animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
        -webkit-transform: translate3d(0, 0, 0);
        transform: translate3d(0, 0, 0);
    }
    40%, 43% {
        -webkit-animation-timing-function: cubic-bezier(0.755, 0.05, 0.855, 0.06);
        animation-timing-function: cubic-bezier(0.755, 0.05, 0.855, 0.06);
        -webkit-transform: translate3d(0, -30px, 0) scaleY(1.1);
        transform: translate3d(0, -3px, 0) scaleY(1.1);
    }
    70% {
        -webkit-animation-timing-function: cubic-bezier(0.755, 0.05, 0.855, 0.06);
        animation-timing-function: cubic-bezier(0.755, 0.05, 0.855, 0.06);
        -webkit-transform: translate3d(0, -15px, 0) scaleY(1.05);
        transform: translate3d(0, -5px, 0) scaleY(1.05);
    }
}
</style>
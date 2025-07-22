<template>
    <div class="h-full flex flex-col" id="cursorPreview">
        <div class="mt-7 mb-3">
            <div class="flex items-center gap-2">
                在下方预览光标效果:
                <my-tooltip content="光标效果关闭状态下可预览">
                    <i-ms-tips-and-updates-outline-rounded class="cursor-pointer"/>
                </my-tooltip>
            </div>
        </div>
        <div class="flex-1 border-gray-300 border-2 bg-white relative rounded-sm" ref="curPreview"></div>
    </div>
</template>

<script setup>
import * as cursorEffects from '@renderer/utils/cursorEffects'
import useSettingStore from '@renderer/store/setting'
import { ref, toRaw, onMounted } from 'vue'
const { options } = defineProps(['options'])
const curPreview = ref(null)
const cur = ref(null)

const { setting } = useSettingStore()
const cursor = setting.cursor

onMounted(() => {
    curPreview.value.addEventListener('mouseleave', () => {
        if(cursor.open) return
        cur.value && cur.value.destroy()
    })
    curPreview.value.addEventListener('mouseenter', () => {
        if(cursor.open) return
        createCursor()
    })
})

function createCursor() {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if(prefersReducedMotion.matches) return
    const raw = toRaw(options)
    cur.value = new cursorEffects[options.cursorName](raw)
}
</script>
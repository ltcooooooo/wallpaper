<template>
  <div class="cursorWindow" ref="cursorWindow"></div>
</template>
<script setup>
import '@renderer/assets/css/cursorWindow.css'
import useSettingStore from '@renderer/store/setting'
import * as cursorEffects from '@renderer/utils/cursorEffects'
import { ref, toRaw, onMounted } from 'vue'
const { setting } = useSettingStore()
const cursor = setting.cursor

const cursorWindow = ref(null)

onMounted(() => {
    createCursor()
})

function createCursor() {
    const raw = toRaw(cursor)
    const cursorType = raw.cursorType[raw.current]
    const options = cursorType.options
    options.element = cursorWindow.value
    new cursorEffects[options.cursorName](options)
}

</script>
<style scoped>
.cursorWindow {
    height: 100vh;
    width: 100vw;
    /* background-color: rgba(255, 255, 255, 0.5); */
}
</style>
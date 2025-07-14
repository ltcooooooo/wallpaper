<template>
    <div id="cursor" class="p-4 h-full flex flex-col text-nowrap">
        <section class="flex items-center gap-5">
            <div>开启鼠标光标效果:</div>
            <el-switch v-model="sursor.open"></el-switch>
        </section>
        <el-divider />
        <el-radio-group
          v-model="sursor.current"
          text-color="#626aef"
          fill="rgb(239, 240, 253)"
        >
            <el-radio-button  v-for="item in sursor.cursorType" :key="item.name"  :label="item.label" :value="item.name" />
        </el-radio-group>
        <div class="h-5"></div>
        <section class="Rainbow" v-show="sursor.current === 'Rainbow'">
            <div class="flex gap-8">
                <div class="flex items-center gap-8 w-50">
                    <div>长度:</div>
                    <div class="flex-1">
                        <el-slider 
                            v-model="sursor.cursorType.Rainbow.options.length" 
                            :min="sursor.cursorType.Rainbow.options.minLength" 
                            :max="sursor.cursorType.Rainbow.options.maxLength" />
                    </div>
                </div>
                <div class="flex items-center gap-8 w-50">
                    <div>大小:</div>
                    <div class="flex-1">
                        <el-slider 
                            v-model="sursor.cursorType.Rainbow.options.size" 
                            :min="sursor.cursorType.Rainbow.options.minSize" 
                            :max="sursor.cursorType.Rainbow.options.maxSize" />
                    </div>
                </div>
            </div>
            <div class="flex items-center gap-5 mt-5">
                <div>颜色:</div>
                <div class="flex-1">
                <template v-for="(c,i) in sursor.cursorType.Rainbow.options.color" :key="i" >
                    <el-color-picker popper-class="l-color-picker" v-model="c.value" />
                </template>
                </div>
            </div>
        </section>
        <section class="Clock" v-show="sursor.current === 'Clock'">
            <div class="flex gap-10 gap-y-5 flex-wrap">
                <div class="flex items-center gap-5 w-full">
                    <div>是否显示日期:</div>
                    <el-switch v-model="sursor.cursorType.Clock.options.showDate"></el-switch>
                </div>
                <div class="flex items-center gap-5">
                    <div>日期颜色:</div>
                    <el-color-picker popper-class="l-color-picker" v-model="sursor.cursorType.Clock.options.dateColor" />
                </div>
                <div class="flex items-center gap-5">
                    <div>小时颜色:</div>
                    <el-color-picker popper-class="l-color-picker" v-model="sursor.cursorType.Clock.options.faceColor" />
                </div>
                <div class="flex items-center gap-5">
                    <div>分针颜色:</div>
                    <el-color-picker popper-class="l-color-picker" v-model="sursor.cursorType.Clock.options.minutesColor" />
                </div>
                <div class="flex items-center gap-5">
                    <div>秒针颜色:</div>
                    <el-color-picker popper-class="l-color-picker" v-model="sursor.cursorType.Clock.options.secondsColor" />
                </div>
                <div class="flex items-center gap-5">
                    <div>时针颜色:</div>
                    <el-color-picker popper-class="l-color-picker" v-model="sursor.cursorType.Clock.options.hoursColor" />
                </div>
            </div>
        </section>
        <section class="textFlag" v-show="sursor.current === 'textFlag'">
            <div class="flex gap-10 gap-y-5 flex-wrap">
                <div class="flex items-center gap-5">
                    <div>文本:</div>
                    <el-input v-model="sursor.cursorType.textFlag.options.text" placeholder="请设置要显示的文字" />
                </div>
                <div class="flex items-center gap-5">
                    <div class="flex items-center gap-2">
                        字体: 
                        <my-tooltip content="只支持系统中已有字体,否则会使用默认字体">
                            <i-ms-tips-and-updates-outline-rounded class="cursor-pointer"/>
                        </my-tooltip>
                    </div>
                    <el-input v-model="sursor.cursorType.textFlag.options.font" placeholder="monospace" />
                </div>
                <div class="flex items-center gap-8 w-50">
                    <div>字号:</div>
                    <div class="flex-1">
                        <el-slider 
                            v-model="sursor.cursorType.textFlag.options.textSize" 
                            :min="sursor.cursorType.textFlag.options.minSize" 
                            :max="sursor.cursorType.textFlag.options.maxSize" />
                    </div>
                </div>
                <div class="flex items-center gap-8 w-50">
                    <div>间距:</div>
                    <div class="flex-1">
                        <el-slider 
                            v-model="sursor.cursorType.textFlag.options.gap" 
                            :min="sursor.cursorType.textFlag.options.minSize" 
                            :max="sursor.cursorType.textFlag.options.maxSize" />
                    </div>
                </div>
            </div>
        </section>
        <section class="emoji" v-show="sursor.current === 'emoji'">
            <div class="flex gap-10 gap-y-5 flex-wrap">
                <div class="flex items-center gap-3">
                    <div>添加emoji:</div>
                    <emoji-picker v-for="(emoji, index) in sursor.cursorType.emoji.options.emoji" :emoji="emoji" @selectEmoji="selectEmoji($event,index)" />
                </div>
            </div>
        </section>
        <section class="preview flex-1">
            <CursorPreview :options="curOptions" />
        </section>
    </div>
</template>

<script setup>
import useSettingStore from '@renderer/store/setting'
import { ref, watch, watchEffect } from 'vue'
const { setting } = useSettingStore()
const sursor = setting.sursor
const curOptions = ref({})

function selectEmoji(emoji, index) {
    sursor.cursorType.emoji.options.emoji[index] = emoji.native
}
watch(() => sursor.open, (isOpen) => {
    console.log('open', isOpen)
})

watchEffect(() => {
    const options = sursor.cursorType[sursor.current].options
    curOptions.value = options
    options.color && (options.colors = options.color.map(item => item.value))
})
</script>
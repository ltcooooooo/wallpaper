<template>
  <div id="cursor" class="p-4 h-full flex flex-col text-nowrap">
    <section class="flex items-center gap-5">
      <div class="flex items-center gap-2">
        开启鼠标光标效果:
        <my-tooltip
          content="切换或修改光标效果后需要重新开启生效，部分效果不支持多屏幕"
          placement="bottom"
        >
          <i-ms-tips-and-updates-outline-rounded class="cursor-pointer" />
        </my-tooltip>
      </div>
      <el-switch
        v-model="cursor.open"
        @change="openCursor"
        :before-change="openBeforeChange"
      ></el-switch>
    </section>
    <el-divider />
    <el-radio-group
      v-model="cursor.current"
      text-color="#626aef"
      fill="rgb(239, 240, 253)"
    >
      <el-radio-button
        v-for="item in cursor.cursorType"
        :key="item.name"
        :label="item.label"
        :value="item.name"
      />
    </el-radio-group>
    <div class="h-5"></div>
    <section class="Rainbow" v-show="cursor.current === 'Rainbow'">
      <div class="flex gap-8">
        <div class="flex items-center gap-5 w-50">
          <div>长度:</div>
          <div class="flex-1">
            <el-slider
              v-model="cursor.cursorType.Rainbow.options.length"
              :min="staticOptions.Rainbow.minLength"
              :max="staticOptions.Rainbow.maxLength"
            />
          </div>
        </div>
        <div class="flex items-center gap-5 w-50">
          <div>大小:</div>
          <div class="flex-1">
            <el-slider
              v-model="cursor.cursorType.Rainbow.options.size"
              :min="staticOptions.Rainbow.minSize"
              :max="staticOptions.Rainbow.maxSize"
            />
          </div>
        </div>
      </div>
      <div class="flex items-center gap-3 mt-5">
        <div>颜色:</div>
        <options-group
          componentName="colors"
          cursorTypeName="Rainbow"
          :isEditable="false"
        ></options-group>
      </div>
    </section>
    <section class="Clock" v-show="cursor.current === 'Clock'">
      <div class="flex gap-10 gap-y-5 flex-wrap">
        <div class="flex items-center gap-5 w-full">
          <div>是否显示日期:</div>
          <el-switch v-model="cursor.cursorType.Clock.options.showDate"></el-switch>
        </div>
        <div class="flex items-center gap-5">
          <div>日期颜色:</div>
          <el-color-picker
            popper-class="l-color-picker"
            v-model="cursor.cursorType.Clock.options.dateColor"
          />
        </div>
        <div class="flex items-center gap-5">
          <div>小时颜色:</div>
          <el-color-picker
            popper-class="l-color-picker"
            v-model="cursor.cursorType.Clock.options.faceColor"
          />
        </div>
        <div class="flex items-center gap-5">
          <div>时针颜色:</div>
          <el-color-picker
            popper-class="l-color-picker"
            v-model="cursor.cursorType.Clock.options.hoursColor"
          />
        </div>
        <div class="flex items-center gap-5">
          <div>分针颜色:</div>
          <el-color-picker
            popper-class="l-color-picker"
            v-model="cursor.cursorType.Clock.options.minutesColor"
          />
        </div>
        <div class="flex items-center gap-5">
          <div>秒针颜色:</div>
          <el-color-picker
            popper-class="l-color-picker"
            v-model="cursor.cursorType.Clock.options.secondsColor"
          />
        </div>
      </div>
    </section>
    <section class="textFlag" v-show="cursor.current === 'textFlag'">
      <div class="flex gap-10 gap-y-5 flex-wrap">
        <div class="flex items-center gap-5">
          <div>文本:</div>
          <el-input
            v-model="cursor.cursorType.textFlag.options.text"
            placeholder="请设置要显示的文字"
          />
        </div>
        <div class="flex items-center gap-5">
          <div class="flex items-center gap-2">
            字体:
            <my-tooltip content="只支持系统中已有字体,否则会使用默认字体">
              <i-ms-tips-and-updates-outline-rounded class="cursor-pointer" />
            </my-tooltip>
          </div>
          <el-input
            v-model="cursor.cursorType.textFlag.options.font"
            placeholder="monospace"
          />
        </div>
        <div class="flex items-center gap-8 w-50">
          <div>字号:</div>
          <div class="flex-1">
            <el-slider
              v-model="cursor.cursorType.textFlag.options.textSize"
              :min="staticOptions.textFlag.minSize"
              :max="staticOptions.textFlag.maxSize"
            />
          </div>
        </div>
        <div class="flex items-center gap-8 w-50">
          <div>间距:</div>
          <div class="flex-1">
            <el-slider
              v-model="cursor.cursorType.textFlag.options.gap"
              :min="staticOptions.textFlag.minSize"
              :max="staticOptions.textFlag.maxSize"
            />
          </div>
        </div>
      </div>
    </section>
    <section class="emoji" v-show="cursor.current === 'emoji'">
      <div class="flex gap-10 gap-y-5 flex-wrap">
        <div class="flex items-center gap-3">
          <div>Emoji:</div>
          <options-group
            componentName="emoji"
            cursorTypeName="emoji"
            :max="10"
            :min="1"
          ></options-group>
        </div>
      </div>
    </section>
    <section class="springyEmoji" v-show="cursor.current === 'springyEmoji'">
      <div class="flex gap-10 gap-y-5 flex-wrap">
        <div class="flex items-center gap-3">
          <div>Emoji:</div>
          <emoji-picker
            :emoji="cursor.cursorType.springyEmoji.options.emoji"
            @selectEmoji="selectSpringyEmoji"
          />
        </div>
      </div>
    </section>
    <section class="bubble" v-show="cursor.current === 'bubble'">
      <div class="flex gap-10 gap-y-5 flex-wrap">
        <div class="flex items-center gap-3">
          <div>填充色:</div>
          <el-color-picker
            popper-class="l-color-picker"
            v-model="cursor.cursorType.bubble.options.fillColor"
          />
        </div>
        <div class="flex items-center gap-3">
          <div>描边色:</div>
          <el-color-picker
            popper-class="l-color-picker"
            v-model="cursor.cursorType.bubble.options.strokeColor"
          />
        </div>
      </div>
    </section>
    <section class="character" v-show="cursor.current === 'character'">
      <div class="flex gap-10 gap-y-5 flex-wrap">
        <div class="flex items-center gap-3 w-full">
          <div>字符:</div>
          <el-input
            style="width: 200px"
            v-model="cursor.cursorType.character.options.text"
            maxlength="10"
            placeholder="hello"
            type="text"
          />
        </div>
        <div class="flex items-center gap-3">
          <div>随机色:</div>
          <options-group
            componentName="colors"
            cursorTypeName="character"
            :max="10"
            :min="1"
          ></options-group>
        </div>
      </div>
    </section>
    <section class="preview flex-1">
      <CursorPreview :options="curOptions" />
    </section>
    <!-- 系统开启了减少动画设置，提示框 -->
    <el-dialog v-model="dialogVisible" title="提示" width="500" center>
      <div class="w-full flex flex-col text-sm">
        <span class="text-black mb-3"
          >检测到系统已启用减少动画，如果想启用该功能，请先关闭减少动画。</span
        >
        <ul>
          <li>在 Windows 10 中：设置 > 轻松获取 > 显示 > 在 Windows 中显示动画。</li>
          <li>在 Windows 11 中：设置 > 辅助功能 > 视觉效果 > 动画效果。</li>
          <li>在 MacOS 中：系统偏好 > 辅助使用 > 显示 > 减少运动。</li>
        </ul>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="dialogVisible = false"> 好的 </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import useSettingStore from "@renderer/store/setting";
import { ref, watchEffect } from "vue";
const { setting } = useSettingStore();
const cursor = setting.cursor;
const curOptions = ref({});
const staticOptions = {
  Rainbow: {
    minLength: 20,
    maxLength: 100,
    minSize: 1,
    maxSize: 5,
  },
  textFlag: {
    minSize: 12,
    maxSize: 50,
    minGap: 12,
    maxGap: 50,
  },
};

function openCursor(isOpen) {
    if (isOpen) {
        const allDisplays = ['fairyDust', 'emoji', 'bubble', 'snowflake', 'character'].includes(cursor.current)
        window.electronAPI.openCursor(allDisplays)
    } else {
        window.electronAPI.closeCursor()
    }
    window.electronAPI.changeTrayStatus({name: '光标效果', status: cursor.open})
}

const dialogVisible = ref(false);
function openBeforeChange() {
    if (!cursor.open) {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (prefersReducedMotion.matches) {
      dialogVisible.value = true;
      return Promise.reject(false);
    }
    return Promise.resolve(true);
  }
  return Promise.resolve(true);
}

watchEffect(() => {
  const options = cursor.cursorType[cursor.current].options;
  curOptions.value = options;
  cursor.cursorType.character.options.characters = cursor.cursorType.character.options.text.split(
    ""
  );
  if (cursor.cursorType.character.options.characters.length === 0) {
    cursor.cursorType.character.options.characters = ["h", "e", "l", "l", "o"];
  }
});

function selectSpringyEmoji(emoji) {
  cursor.cursorType.springyEmoji.options.emoji = emoji.native;
}
</script>

<template>
  <div id="localWallpaper" class="h-full">
    <el-scrollbar>
      <div class="h-full flex flex-wrap justify-center p-4 gap-3 overflow-auto">
        <div
          class="w-75 h-50 rounded-md overflow-hidden shadow-xl transition-all hover:shadow-2xl hover:translate-y-[-2px]"
          v-for="item in wallpaperList"
          :key="item.imgSrc"
        >
          <Card :image="item" :isLocal="true" @delWallpaper="delLocaWallpaper" />
        </div>
      </div>
    </el-scrollbar>
  </div>
</template>

<script setup>
import useSettingStore from "@renderer/store/setting";
import { ref, onActivated } from "vue";
import Message from "@renderer/common/MyElMessage";
const { setting } = useSettingStore();
const savePath = ref(setting.wallpaperSavePath);
const wallpaperList = ref([]);
const readerList = ref(new Set());
const updateList = ref(new Set());
const addWallpaperSet = ref(new Set());

const init = createInit();
onActivated(async () => {
  const isInit = await init();
  if (isInit) return;
  // 进入该页面时发现修改了保存路径
  if (setting.wallpaperSavePath !== savePath.value) {
    savePath.value = setting.wallpaperSavePath;
    readerList.value.clear();
    wallpaperList.value = [];
    await createInit()();
    return;
  }
  // 更新壁纸列表
  getLocalWallpaperList("update");
});

// 第一次进入本地壁纸页面时获取所有壁纸
async function getAllWallpaper() {
  console.log("获取所有壁纸");
  for (const imagePath of readerList.value) {
    const wallpaper = await getWallpaper(imagePath);
    wallpaperList.value.push(wallpaper);
    wallpaperList.value.sort((a, b) => b.ctimeMs - a.ctimeMs);
  }
}
// 获取到壁纸的信息，并将图片buffer转换为blob url
async function getWallpaper(imagePath) {
  const result = await window.electronAPI.getLocalWallpaper(imagePath);
  if (!result.success) return Message({ message: result.message, type: "error" });
  const imageData = result.data;
  const blob = new Blob([imageData.imgBuffer], { type: "image/jpeg" });
  const url = URL.createObjectURL(blob);
  const img = {
    smallSrc: url,
    imgSrc: imageData.imgSrc,
    size: imageData.size,
    ctimeMs: imageData.ctimeMs,
  };
  return img;
}

// 获取保存路径下的图片路径列表
// 如果type是updaye则去跟之前的列表对比找出新的和删除的
async function getLocalWallpaperList(type) {
  const result = await window.electronAPI.getLocalWallpaperList(
    setting.wallpaperSavePath
  );
  if (!result.success) {
    return Message({ message: result.message, type: "error" });
  }
  for (const imagePath of result.images) {
    if (type === "update") {
      // 如果原本里面没有说明是新加的
      !readerList.value.has(imagePath) && (await addWallpaper(imagePath));
      updateList.value.add(imagePath);
    } else {
      readerList.value.add(imagePath);
    }
  }
  if (type === "update") {
    for (const imagePath of readerList.value) {
      if (!updateList.value.has(imagePath)) {
        delLocaWallpaper(imagePath, 0);
      }
    }
    updateList.value.clear();
    addWallpaperSet.value.clear();
  }
}

// 手动在文件夹中添加了图片
async function addWallpaper(imagePath) {
  addWallpaperSet.value.add(imagePath);
  updateList.value.add(imagePath);
  readerList.value.add(imagePath);
  const imageData = await getWallpaper(imagePath);
  wallpaperList.value.unshift(imageData);
}

// 点击删除按钮删除壁纸
function delLocaWallpaper(path, time = 400) {
  const index = wallpaperList.value.findIndex((item) => item.imgSrc === path);
  setTimeout(() => wallpaperList.value.splice(index, 1), time);
}

function createInit() {
  let hasRun = false;
  return async () => {
    if (hasRun) return false;
    hasRun = true;
    await getLocalWallpaperList();
    await getAllWallpaper();
    console.log("init执行了");
    return true;
  };
}
</script>

<template>
  <div id="localWallpaper" class="h-full">
    <el-scrollbar>
      <div class="h-full flex flex-wrap justify-center p-4 gap-3 overflow-auto">
        <div
          class="w-75 h-50 rounded-md overflow-hidden shadow-xl transition-all hover:shadow-2xl hover:translate-y-[-2px]"
          v-for="item in readerList"
          :key="item.imgSrc"
        >
          <Card :image="item" page="local"/>
        </div>
      </div>
    </el-scrollbar>
  </div>
</template>

<script setup>
import useSettingStore from "@renderer/store/setting";
import { ref } from "vue";
import Message from "@renderer/common/MyElMessage";
const { savePath } = useSettingStore();
const wallpaperList = ref(new Set());
const readerList = ref([]);

getLocalWallpaperList()
.then(()=>{
  getAllWallpaper()
  window.electronAPI.localWallpaperChanged((res)=>{
    if(res.success) {
      updateWallpaperList(res.images)
    }
  })
})

// 第一次进入本地壁纸页面时获取所有壁纸
async function getAllWallpaper() {
  console.log("获取所有壁纸");
  for (const imagePath of wallpaperList.value) {
    const wallpaper = await getWallpaper(imagePath);
    readerList.value.push(wallpaper);
    console.log('wall', wallpaper)
    readerList.value.sort((a, b) => b.mtimeMs - a.mtimeMs);
  }
}

// 获取保存路径下的图片路径列表
async function getLocalWallpaperList(type) {
  const result = await window.electronAPI.getLocalWallpaperList(savePath.image);
  if (!result.success) {
    return Message({ message: result.message, type: "error" });
  }
  for (const image of result.images) {
    wallpaperList.value.add(image)
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
    mtimeMs: imageData.mtimeMs,
  };
  return img;
}

// 图片文件夹有文件变动更新列表
async function updateWallpaperList(newList) {
  // 被删除的图片
  wallpaperList.value = new Set(newList);
  const delArr = readerList.value.reduce((pre, image,index)=>{
    if(!wallpaperList.value.has(image.imgSrc)) {
      pre.unshift(index)
    }
    return pre
  }, [])
  for (const index of delArr) {
    readerList.value.splice(index, 1)
  }
  // 新增加的图片
  for(const image of newList) {
    if(!readerList.value.find(item => item.imgSrc === image)) {
      const wallpaper = await getWallpaper(image);
      readerList.value.push(wallpaper);
    }
  }
  readerList.value.sort((a, b) => b.mtimeMs - a.mtimeMs);
}
</script>

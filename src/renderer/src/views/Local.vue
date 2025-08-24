<template>
  <div id="localWallpaper" class="h-full">
    <section class="h-full w-full py-4">
      <list :loadMore="loadMore">
        <div
          class="w-75 h-50 rounded-md overflow-hidden shadow-xl transition-all hover:shadow-2xl hover:translate-y-[-2px]"
          v-for="item in readerList"
          :key="item.imgSrc"
        >
          <Card :data="item" type="image" page="imageLocal" v-slot="CD">
            <section
              class="absolute bottom-0 left-0 bg-[rgba(0,0,0,.4)] text-xs flex items-center justify-between px-3 w-full h-9 translate-y-[100%] group-hover:translate-y-0 transition"
            >
              <div class="text-white">{{ item.size }}</div>
              <div class="text-white">
                <my-tooltip content="删除">
                  <el-button type="danger" size="small" @click="CD.delLocalWallpaper"
                    ><i-ms-delete-outline-rounded
                  /></el-button>
                </my-tooltip>
                <my-tooltip content="设为壁纸">
                  <el-button
                    type="primary"
                    size="small"
                    @click="CD.setWallpaper"
                    :loading="CD.isLoading"
                    ><i-ms-desktop-mac v-show="!CD.isLoading"
                  /></el-button>
                </my-tooltip>
              </div>
            </section>
          </Card>
        </div>
      </list>
    </section>
    <!-- <el-scrollbar>
      <div class="h-full flex flex-wrap justify-center p-4 gap-3 overflow-auto">
        <div
          class="w-75 h-50 rounded-md overflow-hidden shadow-xl transition-all hover:shadow-2xl hover:translate-y-[-2px]"
          v-for="item in readerList"
          :key="item.imgSrc"
        >
        <Card :data="item" type="image" page="imageLocal" v-slot="CD" >
            <section
              class="absolute bottom-0 left-0 bg-[rgba(0,0,0,.4)] text-xs flex items-center justify-between px-3 w-full h-9 translate-y-[100%]  group-hover:translate-y-0 transition">
              <div class="text-white">{{ item.size }}</div>
              <div class="text-white">
                  <my-tooltip  content="删除">
                      <el-button type="danger" size="small" @click="CD.delLocalWallpaper"><i-ms-delete-outline-rounded /></el-button>
                  </my-tooltip>
                  <my-tooltip content="设为壁纸">
                      <el-button type="primary" size="small" @click="CD.setWallpaper" :loading="CD.isLoading"><i-ms-desktop-mac v-show="!CD.isLoading" /></el-button>
                  </my-tooltip>
              </div>
            </section>
          </Card>
        </div>
      </div>
    </el-scrollbar> -->
  </div>
</template>

<script setup>
import useSettingStore from "@renderer/store/setting";
import { ref, onMounted, reactive } from "vue";
import Message from "@renderer/common/MyElMessage";
const { savePath } = useSettingStore();
const wallpaperList = ref(new Set());
const readerList = ref([]);

const loadMore = reactive({
  scrollLoad: false,
  loading: false,
  reLoading: false,
});

// getLocalWallpaperList()
// .then(()=>{
//   getAllWallpaper()
//   window.electronAPI.localWallpaperChanged((res)=>{
//     if(res.success) {
//       updateWallpaperList(res.images)
//     }
//   })
// })
onMounted(() => {
  window.electronAPI.getLocalImageList({ page: 1, pageSize: 100 }).then((res) => {
    console.log("res", res);
    readerList.value = res.data;
  });
});
// 第一次进入本地壁纸页面时获取所有壁纸
async function getAllWallpaper() {
  console.log("获取所有壁纸");
  for (const imagePath of wallpaperList.value) {
    const wallpaper = await getWallpaper(imagePath);
    readerList.value.push(wallpaper);
    console.log("wall", wallpaper);
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
    wallpaperList.value.add(image);
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
  console.log("更新");
  // 被删除的图片
  wallpaperList.value = new Set(newList);
  console.log("wallpaperList", wallpaperList.value);
  const delArr = readerList.value.reduce((pre, image, index) => {
    if (!wallpaperList.value.has(image.imgSrc)) {
      pre.unshift(index);
    }
    return pre;
  }, []);
  console.log("delArr", delArr);
  for (const index of delArr) {
    readerList.value.splice(index, 1);
  }
  console.log("readerList", readerList.value);
  // 新增加的图片
  for (const image of newList) {
    if (!readerList.value.find((item) => item.imgSrc === image)) {
      const wallpaper = await getWallpaper(image);
      readerList.value.push(wallpaper);
    }
  }
  readerList.value.sort((a, b) => b.mtimeMs - a.mtimeMs);
}
</script>

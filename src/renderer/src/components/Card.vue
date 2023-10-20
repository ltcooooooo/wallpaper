<template>
  <div id="card" ref="card">
    <img :src="imgSrc" alt="" />
    <div class="menu">
      <div class="size">{{ data.size }}</div>
      <div class="buttons">
        <el-button :loading="downloading" type="success" size="small" plain @click="download">
          <el-icon v-show="!downloading" :size="16" style="font-weight: bold">
            <Download />
          </el-icon>
        </el-button>
        <el-button :loading="downloading" type="primary" size="small" plain @click="use">
          <el-icon v-show="!downloading" :size="16">
            <Platform />
          </el-icon>
        </el-button>
      </div>
    </div>
    <div class="loading" v-if="loading">
      <img src="@renderer/assets/image/loading.png" alt="" />
    </div>
  </div>
</template>

<script setup>
import { ref, h } from 'vue'
import { Folder, Picture } from '@element-plus/icons-vue'
import axios from 'axios'
const { data, config, closeTips } = defineProps(['data', 'config', 'closeTips'])
const imgSrc = ref('')
const loading = ref(true)
const downloading = ref(false)
axios
  .get('http://154.12.35.130:8866/wallpaper', {
    params: {
      url: encodeURIComponent(data.smallSrc)
    },
    responseType: 'arraybuffer'
  })
  .then((res) => {
    const blob = new Blob([res.data], { type: 'image/jpeg' })
    const url = URL.createObjectURL(blob)
    imgSrc.value = url
    loading.value = false
  })

function use() {
  if (config.useTips) {
    ElMessageBox({
      title: '功能提示',
      message: () =>
        h('div', null, [
          h('p', null, '该按钮会下载壁纸原图，下载成功之后将会设置为电脑壁纸'),
          h('p', { style: `display:flex;align-items:center;` }, [
            h('span', { style: `margin-right:4px` }, '请先在右上角'),
            h(Folder, { width: '16px', height: '16px' }),
            h('span', { style: `margin-left:4px` }, '处设置壁纸保存位置')
          ])
        ]),
      confirmButtonText: '知道了',
      'show-close': false,
      dangerouslyUseHTMLString: true,
      'close-on-click-modal': false,
      callback: () => {
        closeTips('useTips')
      }
    })
  } else {
    if (config.wallpaperPath === '未设置')
      return ElMessage.warning({
        message: '请先在右上角处设置壁纸保存位置',
        offset: 40
      })
    ElMessage.success({
      message: '开始下载壁纸',
      offset: 40
    })
    downloading.value = true
    window.api.useWallpaper(data.imgSrc, config.wallpaperPath, downloadResult)
  }
}

function download() {
  if (config.downloadTips) {
    ElMessageBox({
      title: '功能提示',
      message: () =>
        h('div', null, [
          h('p', null, '- 该按钮会下载壁纸原图到壁纸文件夹'),
          h('p', { style: `display:flex;align-items:center;` }, [
            h('span', { style: `margin-right:4px` }, '- 请先在右上角'),
            h(Folder, { width: '16px', height: '16px' }),
            h('span', { style: `margin-left:4px` }, '处设置壁纸保存位置')
          ]),
          h('p', { style: `display:flex;align-items:center;` }, [
            h('span', { style: `margin-right:4px` }, '- 点击右上角'),
            h(Picture, { width: '16px', height: '16px' }),
            h('span', { style: `margin-left:4px` }, '可快速打开壁纸文件夹')
          ])
        ]),
      confirmButtonText: '知道了',
      'show-close': false,
      dangerouslyUseHTMLString: true,
      'close-on-click-modal': false,
      callback: () => {
        closeTips('downloadTips')
      }
    })
  } else {
    if (config.wallpaperPath === '未设置')
      return ElMessage.warning({
        message: '请先在右上角处设置壁纸保存位置',
        offset: 40
      })
    ElMessage.success({
      message: '开始下载壁纸',
      offset: 40
    })
    downloading.value = true
    window.api.downloadWallpaper(data.imgSrc, config.wallpaperPath, downloadResult)
  }
}

function downloadResult(res) {
  downloading.value = false
  console.log('下载结果', res)
  if (res.success) {
    ElMessage.success({
      message: res.message,
      offset: 40
    })
  } else {
    ElMessage.error({
      message: res.message,
      offset: 40
    })
  }
}
</script>

<style lang="scss">
#card {
  position: relative;
  width: 300px;
  height: 200px;
  margin-bottom: 10px;
  border-radius: 5px;
  background-color: #d0d0d0;
  transition: all 0.3s;
  overflow: hidden;
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 3px 3px 3px rgba(23, 44, 62, 0.2);
  }
  &:hover .menu {
    transform: translateY(0);
  }
  & > img {
    display: block;
    width: 100%;
    height: 100%;
  }
  .menu {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 34px;
    width: 100%;
    box-sizing: border-box;
    padding: 0 10px;
    color: #fff;
    background-color: rgba($color: #000000, $alpha: 0.5);
    position: absolute;
    bottom: 0;
    left: 0;
    font-size: 14px;
    transform: translateY(100%);
    transition: all 0.3s;
    .buttons {
      display: flex;
      div {
        margin-left: 10px;
      }
    }
  }
  .loading {
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    background-color: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9;
    img {
      width: 40px;
      animation: rotate 1s linear infinite;
      opacity: 0.5;
    }
  }
}
</style>
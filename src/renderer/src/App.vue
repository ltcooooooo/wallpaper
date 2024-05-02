<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import Card from './components/Card.vue'
import { getListApi } from './api/request'

const list = ref([])
const page = ref(1)
const totalPage = ref(3)
const loading = ref(true)
const reloading = ref(false)
const noMore = ref(false)

// 从本地存储中获取配置信息，如果没有则使用默认配置
const config = ref(null)
config.value = JSON.parse(localStorage.getItem('config')) || {
  useTips: true,
  downloadTips: true,
  wallpaperPath: '未设置'
}
const wallpaperFolder = computed(() => '当前壁纸保存地址为：' + config.value.wallpaperPath)
// 监听配置的变化，保存到本地存储中
watch(config, (n) => saveConfig(), { deep: true, immediate: true })

//初始获取壁纸列表数据
getList(page.value)

// 监听滚动事件，判断是否需要加载更多数据
const wallpaperEl = ref(null)
onMounted(() => {
  wallpaperEl.value.addEventListener('scroll', function () {
    const top = this.scrollHeight - this.scrollTop
    if (top <= this.clientHeight) {
      if (loading.value) return
      if (totalPage.value === page.value) return (noMore.value = true)
      loading.value = true
      page.value++
      getList(page.value)
    }
  })
})

// 重新加载壁纸列表数据
function reloadingFn() {
  loading.value = true
  reloading.value = false
  getList(page.value)
}

// 设置默认壁纸保存地址
async function setDefaultSavePath() {
  const res = await window.api.setDefaultSavePath(config.value.wallpaperPath)
  if (!res.canceled) {
    config.value.wallpaperPath = res.filePaths[0]
  }
}

// 打开壁纸保存地址
async function openWallpaperSaveFolder() {
  const res = await window.api.openWallpaperSaveFolder(config.value.wallpaperPath)
  if (res !== '') {
    ElMessage.error({
      message: '请检查壁纸保存路径是否正确',
      offset: 40
    })
  }
}

//退出应用
function quit() {
  window.api.quit()
}

//最小化应用
function min() {
  window.api.minimize()
}

// 关闭提示
function closeTips(arg) {
  config.value[arg] = false
  console.log(config)
}

// 保存配置到本地存储
function saveConfig() {
  localStorage.setItem('config', JSON.stringify(config.value))
}
// 获取壁纸列表
async function getList(page) {
  page = page || '1'
  getListApi(page).then(
    (res) => {
      list.value = [...list.value, ...res.data.data]
      loading.value = false
      reloading.value = false
      if (res.data.totalPage) totalPage.value = res.data.totalPage
    },
    (err) => {
      console.log('getListErr', err)
      loading.value = false
      reloading.value = true
      ElMessage.error({
        message: err.message,
        offset: 40
      })
    }
  )
}
</script>

<template>
  <main>
    <div id="title">
      <div class="appTitle">
        <div class="icon"><img src="@renderer/assets/image/icon.png" alt="" /></div>
        <span>精选壁纸</span>
      </div>
      <div class="right">
        <div class="picture" @click="openWallpaperSaveFolder">
          <el-icon :size="16"><Picture /></el-icon>
        </div>
        <el-tooltip :content="wallpaperFolder" placement="bottom" effect="light">
          <div class="folder" @click="setDefaultSavePath">
            <el-icon :size="16"><Folder /></el-icon>
          </div>
        </el-tooltip>
        <div class="min" @click="min">
          <el-icon :size="16"><SemiSelect /></el-icon>
        </div>
        <div class="quit" @click="quit">
          <el-icon :size="16"><CloseBold /></el-icon>
        </div>
      </div>
    </div>
    <div id="wallpaper" ref="wallpaperEl">
      <Card
        class="card"
        v-for="(item, index) in list"
        :key="index"
        :data="item"
        :config="config"
        :closeTips="closeTips"
      ></Card>
      <div id="loading">
        <img v-show="loading" src="@renderer/assets/image/loading.png" alt="" />
        <div class="reloading" @click="reloadingFn" v-show="reloading">加载失败，点击重试</div>
        <div class="noMore" v-show="noMore">没有更多了哦~</div>
      </div>
    </div>
  </main>
</template>

<style lang="scss" scoped>
main {
  display: flex;
  flex-direction: column;
  width: 100vw;
  height: 100vh;
  justify-content: flex-end;
}
#title {
  position: fixed;
  z-index: 99999;
  top: 0;
  left: 0;
  height: 30px;
  width: 100%;
  font-weight: bold;
  background-color: #c4c4d7;
  color: #000;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  -webkit-app-region: drag;
  padding-left: 14px;
  box-sizing: border-box;
  .appTitle {
    display: flex;
    align-items: center;
    height: 100%;
    .icon {
      height: 80%;
      img {
        display: block;
        height: 100%;
        margin-right: 6px;
      }
    }
  }
  .right {
    display: flex;
    height: 100%;
    -webkit-app-region: no-drag;
    div {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 40px;
      height: 100%;
      &:hover {
        background-color: #e4e4ec;
        cursor: pointer;
      }
    }
  }
}
#wallpaper {
  width: 100%;
  display: flex;
  // padding: 3px;
  // width: 96%;
  justify-content: space-evenly;
  flex-wrap: wrap;
  height: calc(100vh - 50px);
  margin: 0 auto;
  overflow: scroll;
}
#loading {
  width: 100%;
  display: flex;
  height: 40px;
  justify-content: center;
  img {
    display: block;
    width: 30px;
    height: 30px;
    animation: rotate 1s linear infinite;
  }
  .reloading {
    cursor: pointer;
    &:hover {
      color: #4382f4;
    }
  }
}
</style>

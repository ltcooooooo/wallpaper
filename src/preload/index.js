import { contextBridge, ipcRenderer, shell } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
// Custom APIs for renderer
const api = {
  // 设置
  getSettingConfig: () => ipcRenderer.invoke('get-setting-config'),
  setSettingConfig: (value) => ipcRenderer.send('set-setting-config', value),
  // 设置保存地址
  setSavePath: (path) => ipcRenderer.invoke('set-save-path', path),

  // 收藏数据
  // getFavoritesList: () => ipcRenderer.invoke('get-favorites-list'),
  addImageFavorite: (params) => ipcRenderer.invoke('add-image-favorite', params),
  delImageFavorite: (params) => ipcRenderer.invoke('del-image-favorite', params),
  getImageFavoriteStatus: (params) => ipcRenderer.invoke('get-image-favorite-status', params),
  getImageFavorites: (params) => ipcRenderer.invoke('get-image-avorites', params),

  // isFavorite: (params) => ipcRenderer.invoke('is-favorite', params),

  // 获取本地图片列表
  getLocalImageList: (params) => ipcRenderer.invoke('get-local-image-List', params),
  // 获取本地视频壁纸
  getLocalVideoList: (params) => ipcRenderer.invoke('get-local-video-List', params),
  // 删除本地图片
  delLocalImage: (params) => ipcRenderer.invoke('del-local-image', params),
  // 删除本地视频
  delLocalVideo: (params) => ipcRenderer.invoke('del-local-video', params),

  // 打开指定路径
  openfilePath: (path) => {shell.openPath(path)},

  // 设置为壁纸
  useWallpaper: ( wallpaperPath) => ipcRenderer.invoke('use-wallpaper', wallpaperPath),
  // 下载图片壁纸
  downloadImage: (params) => ipcRenderer.invoke('download-image', params),
  // 下载视频壁纸
  downloadVideo: (params) => ipcRenderer.invoke('download-video', params),

  // 打开光标效果
  openCursor: (allDisplays) => ipcRenderer.send("open-cursor", allDisplays),
  // 关闭光标效果
  closeCursor: () => ipcRenderer.send("close-cursor"),

  // 发现新版本
  findUpdater: (callback) => ipcRenderer.on("update-available", (_, value) => callback(value)),
  // 开始更新
  startUpdateApp: () => ipcRenderer.send("start-update"),
  // 更新进度
  updateProgress: (callback) => ipcRenderer.on("update-progress", (_, value) => callback(value)),
  // 更新失败
  updateError: (callback) => ipcRenderer.on("update-error", () => callback()),
  // 更新完成
  updateDownloaded: (callback) => ipcRenderer.on("update-downloaded", () => callback()),
  // 开始安装更新
  quitAndInstall: () => ipcRenderer.send("quit-and-install"),

  //更新托盘状态
  changeTrayStatus: (params) => ipcRenderer.send("change-tray-status", params),
  trayChangeStatus: (callback) => ipcRenderer.on("tray-change-status", (_, value) => callback(value)),
  // 退出程序
  quit: () => ipcRenderer.send("quit"),
  // 最小化
  minimize: () => ipcRenderer.send("minimize")
}
// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('electronAPI', api)
  } catch (error) {
    console.error(error)
  }
} else {
  window.electron = electronAPI
  window.electronAPI = api
}

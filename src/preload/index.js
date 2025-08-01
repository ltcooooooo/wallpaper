import { contextBridge, ipcRenderer, shell } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
// Custom APIs for renderer
const api = {
  // 设置
  getSettingConfig: async () => {
    return await ipcRenderer.invoke('get-setting-config')
  },
  setSettingConfig: async (value) => {
    return await ipcRenderer.send('set-setting-config', value)
  },
  // 收藏数据
  getFavoritesList: async () => {
    return await ipcRenderer.invoke('get-favorites-list')
  },
  setFavoritesList: async (value) => {
    return await ipcRenderer.send('set-favorites-list', value)
  },
  // 设置保存地址
  setSavePath: async (path) => {
    return await ipcRenderer.invoke('set-save-path', path)
  },
  // 获取本地壁纸列表
  getLocalWallpaperList: async (path) => {
    return ipcRenderer.invoke('get-local-wallpaper-List', path)
  },
  // 获取本地壁纸
  getLocalWallpaper: async (path) => {
    return await ipcRenderer.invoke('get-local-wallpaper', path)
  },
  // 删除本地壁纸
  delLocalWallpaper: async ( wallpaperPath) => {
    return await ipcRenderer.invoke('del-local-wallpaper', wallpaperPath)
  },
  // 打开保存地址-暂未用到
  openWallpaperSaveFolder: async (path) => {
    return await shell.openPath(path)
  },
  // 设置为壁纸
  useWallpaper: async ( wallpaperPath) => {
    return await ipcRenderer.invoke('use-wallpaper', wallpaperPath)
  },
  // 下载壁纸
  downloadWallpaper: async (url, wallpaperPath) => {
    return await ipcRenderer.invoke('download-wallpaper', url, wallpaperPath)
  },
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

import { contextBridge, ipcRenderer, shell, app } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import { resolve } from 'path'
import { homedir } from 'os'
// Custom APIs for renderer
const api = {
  getSettingConfig: async () => {
    return await ipcRenderer.invoke('get-setting-config')
  },
  setSettingConfig: async (value) => {
    return await ipcRenderer.send('set-setting-config', value)
  },
  getFavoritesList: async () => {
    return await ipcRenderer.invoke('get-favorites-list')
  },
  setFavoritesList: async (value) => {
    return await ipcRenderer.send('set-favorites-list', value)
  },
  setSavePath: async (path) => {
    return await ipcRenderer.invoke('set-save-path', path)
  },
  getLocalWallpaperList: async (path) => {
    return ipcRenderer.invoke('get-local-wallpaper-List', path)
  },
  getLocalWallpaper: async (path) => {
    return await ipcRenderer.invoke('get-local-wallpaper', path)
  },
  openWallpaperSaveFolder: async (path) => {
    return await shell.openPath(path)
  },
  useWallpaper: async ( wallpaperPath) => {
    return await ipcRenderer.invoke('use-wallpaper', wallpaperPath)
  },
  delLocalWallpaper: async ( wallpaperPath) => {
    return await ipcRenderer.invoke('del-local-wallpaper', wallpaperPath)
  },
  downloadWallpaper: async (url, wallpaperPath) => {
    return await ipcRenderer.invoke('download-wallpaper', url, wallpaperPath)
  },
  quit: () => {
    ipcRenderer.send("quit")
  },
  minimize: () => {
    ipcRenderer.send("minimize")
  }
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

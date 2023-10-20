import { contextBridge, ipcRenderer, shell } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import { resolve } from 'path'
import { homedir } from 'os'
// Custom APIs for renderer
const api = {
  getDefaultSavePath: () => {
    return resolve(homedir(), 'Download')
  },
  setDefaultSavePath: async (path) => {
    return await ipcRenderer.invoke('set-default-save-path', path)
  },
  openWallpaperSaveFolder: async (path) => {
    return await shell.openPath(path)
  },
  useWallpaper: async (url, wallpaperPath, callback) => {
    const res = await ipcRenderer.invoke('use-wallpaper', url, wallpaperPath)
    callback(res)
  },
  downloadWallpaper: async (url, wallpaperPath, callback) => {
    const res = await ipcRenderer.invoke('download-wallpaper', url, wallpaperPath)
    callback(res)
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
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  window.electron = electronAPI
  window.api = api
}

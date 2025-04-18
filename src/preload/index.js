import { contextBridge, ipcRenderer, shell } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import { resolve } from 'path'
import { homedir } from 'os'
// Custom APIs for renderer
const api = {
  getDefaultSavePath: () => {
    return resolve(homedir(), 'Download')
  },
  setSavePath: async (path) => {
    return await ipcRenderer.invoke('set-save-path', path)
  },
  openWallpaperSaveFolder: async (path) => {
    return await shell.openPath(path)
  },
  useWallpaper: async (url, wallpaperPath) => {
    return await ipcRenderer.invoke('use-wallpaper', url, wallpaperPath)
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

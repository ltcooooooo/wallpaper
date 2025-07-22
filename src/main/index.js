import { app, BrowserWindow, Menu } from 'electron'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'

import { createMainWindow } from './common/window'

import createTray from './core/tray'

import globalMountElog from './core/logger'
import registerUpdateService from './core/update'
import registerIpc from './ipc/index'
console.log('appData', app.getPath('appData'))

// macos去掉默认顶部菜单栏
Menu.setApplicationMenu(null)

let mainWindow
app.whenReady().then(() => {
  electronApp.setAppUserModelId('run.tianci.wallpaper')

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) {
      mainWindow = createMainWindow()
    }
  })

  globalMountElog()
  registerIpc()
  mainWindow = createMainWindow()
  createTray(mainWindow)
  import.meta.env.PROD && registerUpdateService().checkForUpdates()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})


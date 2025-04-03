import { app, shell, BrowserWindow } from 'electron'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import { join } from 'path'

import icon from '../../resources/icon.png?asset'

import globalMountElog from './core/logger'
import registerIpc from './ipc/index'
import registerUpdateService from './core/update'

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 638,
    height: 500,
    minHeight: 500,
    minWidth: 350,
    maxWidth: 1000,
    show: false,
    autoHideMenuBar: true,
    frame: false,
    minimizable: false,
    maximizable: false,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      webSecurity: import.meta.env.PROD == true
    }
  })
  import.meta.env.PROD == false && mainWindow.openDevTools()

  mainWindow.on('ready-to-show', () => {
    registerUpdateService().checkForUpdates()
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

app.whenReady().then(() => {
  electronApp.setAppUserModelId('run.tianci.wallpaper')

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })
  registerIpc()
  globalMountElog()
  createWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})


import { app, shell, BrowserWindow } from 'electron'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import { join } from 'path'

import icon from '../../resources/icon.png?asset'

import globalMountElog from './core/logger'
import registerUpdateService from './core/update'
import registerIpc from './ipc/index'

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 970,
    height: 716,
    minHeight: 500,
    minWidth: 340,
    maxWidth: 1280,
    show: false,
    autoHideMenuBar: true,
    frame: false,
    transparent: true,
    minimizable: false,
    maximizable: false,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      spellcheck:false,
      webSecurity: import.meta.env.PROD == true
    }
  })
  import.meta.env.PROD == false && mainWindow.openDevTools()

  mainWindow.on('ready-to-show', () => {
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

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })

  globalMountElog()
  registerIpc()
  createWindow()
  registerUpdateService().checkForUpdates()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})


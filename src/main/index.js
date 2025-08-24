import { app, BrowserWindow, Menu } from 'electron'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'

import sequelize from './models/db'
import syncDb from './models/sync'

//防止启动多个应用实例
const additionalData = { myKey: 'liangtianci.wallpaper' }
const gotTheLock = app.requestSingleInstanceLock(additionalData)
gotTheLock || app.quit()

import { createMainWindow } from './common/window'

import createTray from './core/tray'

import globalMountElog from './core/logger'
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

  // 日志模块
  globalMountElog()

  //数据库
  sequelize.authenticate().then(() => {
    syncDb()
  }).catch((error) => {
    Elog.error('Unable to connect to the database:', error);
  });

  // 注册Ipc模块
  registerIpc()
  
  // 创建主窗口
  mainWindow = createMainWindow()
  createTray(mainWindow)
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})


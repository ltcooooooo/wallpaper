import { BrowserWindow, screen, shell } from "electron";
import { is } from '@electron-toolkit/utils'
import { join } from 'path'
import { set } from "wallpaper";

import icon from '../../../resources/icon.png?asset'

import openCursor from './openCursor'

import registerUpdateService from '../core/update'

let cursorWindow = [];
function createCursorWindow(allDisplays) {
    // 创建多屏窗口
    if(allDisplays){
        const screenAll = screen.getAllDisplays();
        for (const display of screenAll) {
            const bounds = display.bounds;
            cursorWindow.push(createWindow(bounds));
        }
    } else {
        // 单屏窗口
        const bounds = screen.getPrimaryDisplay().bounds
        cursorWindow.push(createWindow(bounds));
    }
}

function destroyCursorWindow() {
    for (const cursor of cursorWindow) {
        cursor.destroy();
    }
}

function createWindow(bounds) {
    const cursorWindow = new BrowserWindow({
        transparent: true,
        show: false,
        frame: false,
        roundedCorners: false,
        focusable: false,
        skipTaskbar: true,
        hasShadow: false,
        hiddenInMissionControl: true,
        x: 0,
        y: 0,
        width: 500,
        height: 500,
        webPreferences: {
            preload: join(__dirname, '../preload/index.js'),
            sandbox: false,
            spellcheck: false,
            webSecurity: import.meta.env.PROD == true
        }
    })
    if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
        cursorWindow.loadURL(process.env['ELECTRON_RENDERER_URL'] + '#/cursorWindow')
    } else {
        cursorWindow.loadFile(join(__dirname, '../renderer/index.html'), {hash: '#/cursorWindow'})
    }
    cursorWindow.on('ready-to-show', () => {
        cursorWindow.show()
    })
    // cursorWindow.openDevTools()
    cursorWindow.setBounds(bounds)
    // 忽略鼠标事件，传递给渲染进程
    cursorWindow.setIgnoreMouseEvents(true, { forward: true })
    // 设置为置顶，层级为屏幕保护级
    cursorWindow.setAlwaysOnTop(true, 'screen-saver')
    // macos 在所有工作区之上显示， visibleOnFullScreen 全屏窗口上方可见
    cursorWindow.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true})
    return cursorWindow
}

function createMainWindow() {
  const mainWindow = new BrowserWindow({
    width: 970,
    height: 716,
    minHeight: 500,
    minWidth: 650,
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
//   mainWindow.openDevTools()

  mainWindow.on('ready-to-show', () => {
    openCursor()
    mainWindow.show()
    // 全量更新模块
    const autoUpdater = registerUpdateService(mainWindow)
    is.dev || autoUpdater.checkForUpdates()
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
  return mainWindow
}

export { createCursorWindow, destroyCursorWindow, createMainWindow }
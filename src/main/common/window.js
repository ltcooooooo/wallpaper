import { BrowserWindow, screen, shell } from "electron";
import { is } from '@electron-toolkit/utils'
import { join } from 'path'
import { set } from "wallpaper";
import { attach, detach, reset } from "electron-as-wallpaper"

import icon from '../../../resources/icon.png?asset'

import { openCursor, openLive } from './startOpenWin'

import registerUpdateService from '../core/update'

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
    mainWindow.show()
    // 全量更新模块
    const autoUpdater = registerUpdateService(mainWindow)
    is.dev || autoUpdater.checkForUpdates()
    openCursor()
    openLive()
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

let cursorWindows = [];
function setCursorWindows(allDisplays) {
    // 创建多屏窗口
    if(allDisplays){
        const screenAll = screen.getAllDisplays();
        for (const display of screenAll) {
            const bounds = display.bounds;
            cursorWindows.push(cursorWinInstance(bounds));
        }
    } else {
        // 单屏窗口
        const bounds = screen.getPrimaryDisplay().bounds
        cursorWindows.push(cursorWinInstance(bounds));
    }
}

function unsetCursorWindows() {
    for (const cursor of cursorWindows) {
        cursor.destroy();
    }
    cursorWindows.length = 0;
}

function cursorWinInstance(bounds) {
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
            // partition: 'persist:cursorWindow', // 多屏窗口使用同一个session
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


export let liveWindows = [];
function setLiveWindows() {
    // 创建多屏窗口
    const screenAll = screen.getAllDisplays();
    console.log('screenAll', screenAll)
    for (const display of screenAll) {
        const bounds = display.bounds;
        liveWindows.push(liveWinInstance(bounds));
    }
}

function unsetLiveWindows() {
    for (const live of liveWindows) {
        detach(live)
        live.destroy();
    }
    liveWindows.length = 0;
}

function liveWinInstance(bounds) {
  const platform =  process.platform
  console.log('platform', platform)
  const liveWindow = new BrowserWindow({
      transparent: true,
      show: false,
      frame: false,
      roundedCorners: false,
      focusable: false,
      ...(platform === 'darwin' ? { type: 'desktop' } : {}),
      ...(platform === 'win32' ? { autoHideMenuBar: true, skipTaskbar: true} : {}),
      webPreferences: {
          preload: join(__dirname, '../preload/index.js'),
          sandbox: false,
          spellcheck: false,
          webSecurity: import.meta.env.PROD == true
      }
  })
  liveWindow.setBounds(bounds)
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
        liveWindow.loadURL(process.env['ELECTRON_RENDERER_URL'] + '#/liveWindow')
    } else {
        liveWindow.loadFile(join(__dirname, '../renderer/index.html'), {hash: '#/liveWindow'})
    }
    liveWindow.on('ready-to-show', () => {
        if(platform === 'win32') {
            attach(liveWindow)
        }
        liveWindow.show()
    })
    // liveWindow.openDevTools()
    return liveWindow
}

export { setCursorWindows, unsetCursorWindows, setLiveWindows, unsetLiveWindows, createMainWindow }
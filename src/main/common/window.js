import { BrowserWindow, screen } from "electron";
import { is } from '@electron-toolkit/utils'
import { join } from 'path'
import { set } from "wallpaper";

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
        cursorWindow.loadFile(join(__dirname, '../renderer/index.html' + '#/cursorWindow'))
    }
    cursorWindow.on('ready-to-show', () => {
        cursorWindow.show()
    })
    // cursorWindow.openDevTools()
    // 解决macos下光标残留阴影
    cursorWindow.setHasShadow(false);
    cursorWindow.setBounds(bounds)
    // 忽略鼠标事件，传递给渲染进程
    cursorWindow.setIgnoreMouseEvents(true, { forward: true })
    // 设置为置顶，层级为屏幕保护级
    cursorWindow.setAlwaysOnTop(true, 'screen-saver')
    // macos 在所有工作区之上显示， visibleOnFullScreen 全屏窗口上方可见
    cursorWindow.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true})
    return cursorWindow
}

export { createCursorWindow, destroyCursorWindow }
import { BrowserWindow, screen, app } from "electron";
import { is } from '@electron-toolkit/utils'
import { join } from 'path'
import { set } from "wallpaper";

let cursorWindow = null;
function createCursorWindow() {
    cursorWindow = createWindow();
}

function destroyCursorWindow() {
    cursorWindow.destroy();
}

function createWindow() {
    const cursorWindow = new BrowserWindow({
        transparent: true,
        show: true,
        x: 0,
        y: 0,
        width: 500,
        height: 500,
        webPreferences: {
            preload: join(__dirname, '../preload/index.js'),
            sandbox: false,
            spellcheck: false,
            webSecurity: import.meta.env.PROD == true,
        }
    })
    cursorWindow.openDevTools()
    const bounds = screen.getPrimaryDisplay().bounds
    cursorWindow.setBounds(bounds)
    cursorWindow.setIgnoreMouseEvents(true, true)
    cursorWindow.setAlwaysOnTop(true, 'screen-saver')
    cursorWindow.setVisibleOnAllWorkspaces(true)
    cursorWindow.on('ready-to-show', () => {
        cursorWindow.show()
    })
    if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
        cursorWindow.loadURL(process.env['ELECTRON_RENDERER_URL'] + '#/cursorWindow')
    } else {
        cursorWindow.loadFile(join(__dirname, '../renderer/index.html' + '#/cursorWindow'))
    }
    return cursorWindow
}

export { createCursorWindow, destroyCursorWindow }
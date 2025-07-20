import { ipcMain } from "electron";
import { createCursorWindow, destroyCursorWindow } from '../common/window'

function registerCursorIpc() {
    ipcMain.on('open-cursor', (event) => {
        createCursorWindow()
    })
    ipcMain.on('close-cursor', (event) => {
        destroyCursorWindow()
    })
}

export default registerCursorIpc
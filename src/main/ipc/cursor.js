import { ipcMain } from "electron";
import { createCursorWindow, destroyCursorWindow } from '../common/window'

function registerCursorIpc() {
    ipcMain.on('open-cursor', (event, allDisplays) => {
        createCursorWindow(allDisplays)
    })
    ipcMain.on('close-cursor', (event) => {
        destroyCursorWindow()
    })
}

export default registerCursorIpc
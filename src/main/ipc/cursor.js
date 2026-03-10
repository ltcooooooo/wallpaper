import { ipcMain } from "electron";
import { setCursorWindows, unsetCursorWindows } from '../common/window'

function registerCursorIpc() {
    ipcMain.on('open-cursor', (event, allDisplays) => {
        setCursorWindows(allDisplays)
    })
    ipcMain.on('close-cursor', (event) => {
        unsetCursorWindows()
    })
}

export default registerCursorIpc
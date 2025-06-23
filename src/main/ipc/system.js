import { ipcMain, BrowserWindow, dialog, app } from "electron";

function registerSystemIpc() {
    ipcMain.on('quit', () => {
        app.quit()
    })
    ipcMain.on('minimize', (event) => {
        const win = BrowserWindow.fromWebContents(event.sender)
        win.minimize()
    })
}

export default registerSystemIpc
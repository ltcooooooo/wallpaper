import { ipcMain, BrowserWindow, dialog, app } from "electron";

function registerSystemIpc() {
    ipcMain.handle('set-default-save-path', async (event, path) => {
        const win = BrowserWindow.fromWebContents(event.sender)
        return await dialog.showOpenDialog(win, {
            title: '壁纸保存位置',
            defaultPath: path,
            properties: ['openDirectory', 'createDirectory']
        })
    })

    ipcMain.on('quit', () => {
        app.quit()
    })
    ipcMain.on('minimize', (event) => {
        const win = BrowserWindow.fromWebContents(event.sender)
        win.minimize()
    })
}

export default registerSystemIpc
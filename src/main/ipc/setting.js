import { ipcMain, BrowserWindow, dialog, app } from "electron";

function registerSettingIpc() {
    ipcMain.handle('set-save-path', async (event, path) => {
        const win = BrowserWindow.fromWebContents(event.sender)
        return await dialog.showOpenDialog(win, {
            title: '壁纸保存位置',
            defaultPath: path,
            properties: ['openDirectory', 'createDirectory']
        })
    })
    ipcMain.handle('get-default-save-path', async (event, path) => {
        return app.getPath('pictures')
    })
}

export default registerSettingIpc
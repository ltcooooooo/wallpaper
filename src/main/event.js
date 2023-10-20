import { ipcMain, BrowserWindow, dialog, app } from "electron";
import axios from 'axios'
import wallpaper from 'wallpaper'
import fs from 'fs'


ipcMain.handle('set-default-save-path', async (event, path) => {
    const win = BrowserWindow.fromWebContents(event.sender)
    return await dialog.showOpenDialog(win, {
        title: '壁纸保存位置',
        defaultPath: path,
        properties: ['openDirectory', 'createDirectory']
    })
})
ipcMain.handle('use-wallpaper', async (event, url, path) => {
    const downloadResult = await downloadWallpaper(url, path)
    if (!downloadResult.success) return downloadResult
    try {
        const setWallpaperReslut = await wallpaper.set(downloadResult.filePath, { screen: 'all' })
        return Promise.resolve({ success: 1, message: '设置壁纸成功' })
    }
    catch (err) {
        return Promise.resolve({ success: 0, message: "设置壁纸失败" })
    }
})
ipcMain.handle('download-wallpaper', async (event, url, path) => {
    return await downloadWallpaper(url, path)
})

ipcMain.on('quit', () => {
    app.quit()
})
ipcMain.on('minimize', (event) => {
    const win = BrowserWindow.fromWebContents(event.sender)
    win.minimize()
})

async function downloadWallpaper(url, path) {
    const urlSplit = url.split("/")
    const last = urlSplit[urlSplit.length - 1]
    const name = last.replace(/wallhaven-/, '')
    const filePath = path + (/\//.test(path) ? "/" : "\\") + name
    try {
        const res = await axios.get('http://154.12.35.130:8866/wallpaper', {
            params: {
                url: encodeURIComponent(url)
            },
            responseType: 'arraybuffer'
        })
        const imageBuffer = Buffer.from(res.data);
        try {
            const result = fs.writeFileSync(filePath, imageBuffer)
            return Promise.resolve({ success: 1, message: '下载成功', filePath })
        }
        catch (err) {
            return Promise.resolve({ success: 0, message: '壁纸下载失败,请检查壁纸文件夹路径' })
        }
    }
    catch (err) {
        return Promise.resolve({ success: 0, message: "壁纸下载失败" })
    }
}
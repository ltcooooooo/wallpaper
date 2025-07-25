import { autoUpdater } from 'electron-updater'
import path from 'path'
import { app, ipcMain } from 'electron'

const isDev = import.meta.env.DEV

ipcMain.on('start-update',()=>{
    autoUpdater.downloadUpdate()
})
ipcMain.on('quit-and-install',()=>{
    autoUpdater.quitAndInstall()
})

function registerUpdateService(mainWindow) {
    if (isDev) {
        Object.defineProperty(app, 'isPackaged', {
            get: () => true
        })
        autoUpdater.updateConfigPath = path.join(__dirname, '../../dev-app-update.yml')
    }

    autoUpdater.autoDownload = false // 不允许自动下载更新
    autoUpdater.allowDowngrade = true // 允许降级更新（应付回滚的情况）

    autoUpdater.on('checking-for-update', () => {
        console.log('checking-for-update')
    })
    autoUpdater.on('update-available', (info) => {
        Elog.info('find update', info)
        // autoUpdater.downloadUpdate()
        mainWindow.webContents.send('update-available', info)
    })
    autoUpdater.on('update-not-available', (info) => {
        console.log('not update', info.version)
    })
    autoUpdater.on('download-progress', (progressInfo) => {
        console.log('download progress', progressInfo)
        Elog.info('download progress', progressInfo)
        mainWindow.webContents.send('update-progress', progressInfo)
    })
    autoUpdater.on('update-downloaded', () => {
        Elog.info('downloaded')
        mainWindow.webContents.send('update-downloaded')
    })
    autoUpdater.on('error', (errorMessage) => {
        Elog.error('更新时出错了', errorMessage)
        mainWindow.webContents.send('update-error')
    })
    return autoUpdater
}


export default registerUpdateService

import { autoUpdater } from 'electron-updater'
import path from 'path'
import { app } from 'electron'

const isDev = import.meta.env.DEV

function registerUpdateService() {
    if (isDev) {
        Object.defineProperty(app, 'isPackaged', {
            get: () => true
        })
        autoUpdater.updateConfigPath = path.join(__dirname, '../../dev-app-update.yml')
    }

    autoUpdater.autoDownload = false // 不允许自动下载更新
    autoUpdater.allowDowngrade = true // 允许降级更新（应付回滚的情况）

    autoUpdater.on('checking-for-update', () => {
        Elog.info('开始检查更新')
    })
    autoUpdater.on('update-available', (info) => {
        Elog.info('发现更新版本', info)
        autoUpdater.downloadUpdate()
    })
    autoUpdater.on('update-not-available', (info) => {
        Elog.info('不需要全量更新', info.version)
    })
    autoUpdater.on('download-progress', (progressInfo) => {
        Elog.info('更新进度信息', progressInfo)
    })
    autoUpdater.on('update-downloaded', () => {
        Elog.info('更新下载完成')
        autoUpdater.quitAndInstall()
    })
    autoUpdater.on('error', (errorMessage) => {
        Elog.error('更新时出错了', errorMessage)
    })
    return autoUpdater
}


export default registerUpdateService

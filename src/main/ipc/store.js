import { ipcMain } from 'electron'
import { configStore, dbStore } from '../store'
function registerStoreIpc() {
    ipcMain.handle('get-setting-config', (event) => {
        return configStore.get('settings')
    })
    ipcMain.on('set-setting-config', (event, value) => {
        configStore.set('settings', value)
    })
    ipcMain.handle('get-favorites-list', (event) => {
        return dbStore.get('favorites')
    })
    ipcMain.on('set-favorites-list', (event, value) => {
        const res = dbStore.set('favorites', value)
        console.log(res)
    })
}

export default registerStoreIpc
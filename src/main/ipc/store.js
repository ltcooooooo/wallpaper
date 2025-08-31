import { ipcMain } from 'electron'
import { configStore, dbStore } from '../store'
function registerStoreIpc() {
    ipcMain.handle('get-setting-config', (event) => {
        return configStore.get('settings')
    })
    ipcMain.on('set-setting-config', (event, value) => {
        configStore.set('settings', value)
    })
}

export default registerStoreIpc
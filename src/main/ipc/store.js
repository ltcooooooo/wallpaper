import { ipcMain } from 'electron'
import { configStore } from '../store'
function registerStoreIpc() {
    ipcMain.handle('get-setting-config', (event) => {
        return configStore.get('settings')
    })
    ipcMain.on('set-setting-config', async (event, value) => {
        console.log('set-setting-config', value)
        configStore.set('settings', value)
    })
}

export default registerStoreIpc
import Store from 'electron-store';
import { app } from 'electron'
import { join } from 'path'
import fs from 'fs-extra'

const dataPath = join(app.getPath('appData'), app.getName(), 'data')
fs.ensureDirSync(join(dataPath, 'images'))
fs.ensureDirSync(join(dataPath, 'videos'))

const defaultSettings = {
    dataPath,
    autoStart: false,
    cursor: {
        open: false
    }
}
const configStore = new Store({ name: 'config' })
configStore.has('settings') || configStore.set('settings', defaultSettings)
const setting = configStore.get('settings')
if (setting.wallpaperSavePath) {
    setting.dataPath = dataPath
    delete setting.wallpaperSavePath
    configStore.set('settings', setting)
}

const dbStore = new Store({ name: 'db' })
dbStore.has('favorites') || dbStore.set('favorites',[])

export {
    configStore,
    dbStore
}
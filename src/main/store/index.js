import Store from 'electron-store';
import { app } from 'electron'
import { join } from 'path'
import fs from 'fs-extra'

const dataPath = join(app.getPath('userData'), 'data')
fs.ensureDirSync(join(dataPath, 'images'))
fs.ensureDirSync(join(dataPath, 'videos'))

const defaultSettings = {
    dataPath,
    autoStart: false,
    liveWallpaper: false,
    livePath: '',
    cursor: {
        open: false
    }
}
const configStore = new Store({ name: 'config' })
configStore.has('settings') || configStore.set('settings', defaultSettings)
const setting = configStore.get('settings')

const dbStore = new Store({ name: 'db' })
dbStore.has('favorites') || dbStore.set('favorites',[])

export {
    configStore,
    dbStore
}
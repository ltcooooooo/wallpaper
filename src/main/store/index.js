import Store from 'electron-store';
import { app } from 'electron'

const defaultWallpaperSavePath = app.getPath('pictures')
const defaultSettings = {
    wallpaperSavePath: defaultWallpaperSavePath,
}
const configStore = new Store({ name: 'config' })
configStore.has('settings') || configStore.set('settings', defaultSettings)
const dbStore = new Store({ name: 'db' })
dbStore.has('db') || dbStore.set('db',{})

export {
    configStore,
    dbStore
}
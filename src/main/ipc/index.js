import registerSystemIpc from './system'
import registerWallpaperIpc from './wallpaper'
import registerSettingIpc from './setting'
import registerStoreIpc from './store'
import registerCursorIpc from './cursor'

function registerIpc(){
    //系统相关的事件
    registerSystemIpc()
    //壁纸相关的事件
    registerWallpaperIpc()
    //系统相关的事件
    registerSettingIpc()
    //store相关事件
    registerStoreIpc()
    //cursor相关事件
    registerCursorIpc()
}

export default registerIpc
import registerSystemIpc from './system'
import registerWallpaperIpc from './wallpaper'

function registerIpc(){
    //系统相关的事件
    registerSystemIpc()
    //壁纸相关的事件
    registerWallpaperIpc()
}

export default registerIpc
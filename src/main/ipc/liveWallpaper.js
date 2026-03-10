import { ipcMain } from "electron";
import { setLiveWindows, unsetLiveWindows, liveWindows } from '../common/window'

function registerLiveIpc() {
    ipcMain.on('live-wallpaper-status', (event, falg) => {
        falg ? setLiveWindows() : unsetLiveWindows()
    })
    ipcMain.handle('set-video-wallpaper-path', (event, videoPath) => {
        const isCloseLive = liveWindows.length === 0
        // 如果当前视频壁纸还未开启，创建视频壁纸窗口
        if(isCloseLive) {
            setLiveWindows()
        } else {
            // 如果当前视频壁纸已经开启，更新窗口内视频
            liveWindows.forEach(w => {
                w.webContents.send('update-video-path', videoPath)
                // console.log('liveWindows2', w)
            })
        }
        return Promise.resolve({ success: true, message: '设置壁纸成功', openLive: isCloseLive})
    })
}

export default registerLiveIpc
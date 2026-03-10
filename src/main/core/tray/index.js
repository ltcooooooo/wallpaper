import { Tray, Menu, ipcMain } from 'electron'
import { trayIcon, autoStartOff, autoStartOn, cursorOn, cursorOff, liveOn, liveOff, quit, openWin } from './getTrayIcon.js'
import { configStore } from '../../store'
import { setCursorWindows, unsetCursorWindows, setLiveWindows, unsetLiveWindows } from '../../common/window'

import { setAutoLaunch } from '../autoLaunch'

const { autoStart, cursor, liveWallpaper } = configStore.get('settings')

let mainWin = null

const contextMenu = Menu.buildFromTemplate([
    { id: 1, sort: 3, label: '开机自启动', status: true, visible: autoStart, icon: autoStartOn, click: trayItemStatusChange },
    { id: 2, sort: 2, label: '开机自启动', status: false, visible: !autoStart, icon: autoStartOff, click: trayItemStatusChange },
    { id: 3, sort: 1, label: '退出', role: 'quit', icon: quit },
    { id: 4, sort: 4, label: '光标效果', status: true, visible: cursor.open, icon: cursorOn, click: trayItemStatusChange },
    { id: 5, sort: 5, label: '光标效果', status: false, visible: !cursor.open, icon: cursorOff, click: trayItemStatusChange },
    { id: 6, sort: 8, label: '打开主窗口', icon: openWin, click: () => mainWin.show() },
    { id: 7, sort: 6, label: '动态壁纸', status: true, visible: liveWallpaper, icon: liveOn, click: trayItemStatusChange },
    { id: 8, sort: 7, label: '动态壁纸', status: false, visible: !liveWallpaper, icon: liveOff, click: trayItemStatusChange },
    
].sort((a, b) => b.sort - a.sort))

ipcMain.on('change-tray-status', (_, params) => {
    const { name, status } = params
    const menuItem = contextMenu.items.find(item => item.label === name && item.status !== status)
    trayItemStatusChange(menuItem, false)
})

function trayItemStatusChange(menuItem, sendIpc = true) {
    const settings = configStore.get('settings')
    const isOpenCursor = [4,5].includes(menuItem.id)
    const isAutoStart = [1,2].includes(menuItem.id)
    const isLiveWallpaper = [7,8].includes(menuItem.id)
    const status = menuItem.status
    if(isAutoStart) {
        setAutoLaunch(!status).then(res=>{
            switchMenuItemShow(menuItem)
            if(sendIpc) {
                mainWin.webContents.send('tray-change-status', {name: menuItem.label, status: !status})
            }
        })
    }
    if(isOpenCursor) {
        settings.cursor.open = !status
        configStore.set('settings',settings)
        if(settings.cursor.open){
            const allDisplays = ['fairyDust', 'emoji', 'bubble', 'snowflake', 'character'].includes(cursor.current)
            setCursorWindows(allDisplays)
        }else {
            unsetCursorWindows()
        }
        switchMenuItemShow(menuItem)
        if(sendIpc) {
            mainWin.webContents.send('tray-change-status', {name: menuItem.label, status: settings.cursor.open})
        }
    }
    if(isLiveWallpaper) {
        settings.liveWallpaper = !status
        configStore.set('settings',settings)
        if(settings.liveWallpaper){
            setLiveWindows()
        } else {
            unsetLiveWindows()
        }
        switchMenuItemShow(menuItem)
        if(sendIpc) {
            mainWin.webContents.send('tray-change-status', {name: menuItem.label, status: settings.liveWallpaper})
        }
    }

}

function switchMenuItemShow(menuItem) {
    const menus = menuItem.menu.items
    const contraryStatusMenuItem = menus.find(item => item.label === menuItem.label && item.status !== menuItem.status)
    contraryStatusMenuItem.visible = true
    menuItem.visible = false
}


function createTray(mainWindow) {
    mainWin = mainWindow
    const tray = new Tray(trayIcon);
    tray.setToolTip('wallpaper');
    tray.on('double-click', () => {
        // 打开主窗口
        mainWin.show()
    });
    tray.setContextMenu(contextMenu);
}

export default createTray
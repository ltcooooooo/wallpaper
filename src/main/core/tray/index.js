import { Tray, Menu, ipcMain } from 'electron'
import { trayIcon, autoStartOff, autoStartOn, cursorOn, cursorOff, quit } from './getTrayIcon.js'
import { configStore } from '../../store'
import { createCursorWindow, destroyCursorWindow } from '../../common/window'

import { setAutoLaunch } from '../autoLaunch'

const { autoStart, cursor } = configStore.get('settings') || { autoStart: false, cursor: false }

let mainWin = null

const contextMenu = Menu.buildFromTemplate([
    { id: 4, label: '光标效果', type: 'normal', status: true, visible: cursor.open, icon: cursorOn, click: trayItemStatusChange },
    { id: 5, label: '光标效果', type: 'normal', status: false, visible: !cursor.open, icon: cursorOff, click: trayItemStatusChange },
    { id: 1, label: '开机自启动', type: 'normal', status: true, visible: autoStart, icon: autoStartOn, click: trayItemStatusChange },
    { id: 2, label: '开机自启动', type: 'normal', status: false, visible: !autoStart, icon: autoStartOff, click: trayItemStatusChange },
    { id: 3, label: '退出', type: 'normal', role: 'quit', icon: quit },
])

ipcMain.on('change-tray-status', (_, params) => {
    const { name, status } = params
    const menuItem = contextMenu.items.find(item => item.label === name && item.status !== status)
    trayItemStatusChange(menuItem, false)
})

function trayItemStatusChange(menuItem, sendIpc = true) {
    const settings = configStore.get('settings')
    const isOpenCursor = [4,5].includes(menuItem.id)
    const isAutoStart = [1,2].includes(menuItem.id)
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
            createCursorWindow(allDisplays)
        }else {
            destroyCursorWindow()
        }
        switchMenuItemShow(menuItem)
        if(sendIpc) {
            mainWin.webContents.send('tray-change-status', {name: menuItem.label, status: settings.cursor.open})
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
        mainWindow.show()
    });
    tray.setContextMenu(contextMenu);
}

export default createTray
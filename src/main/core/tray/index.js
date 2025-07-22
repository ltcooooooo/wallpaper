import { Tray, Menu } from 'electron'
import { trayIcon, autoStartOff, autoStartOn, quit } from './getTrayIcon.js'
import { configStore } from '../../store'

import { setAutoLaunch } from '../autoLaunch'
 
let tray = null;

const autoStart = configStore.get('settings').autoStart || false

function autoStartChange(menuItem) {
    const settings = configStore.get('settings')
    settings.autoStart = menuItem.id === 1 ? false : true
    setAutoLaunch(settings.autoStart).then(res=>{
        console.log('res', res)
        configStore.set('settings', settings)
        menuItem.menu.getMenuItemById(menuItem.id === 1 ? 2 : 1).visible = true
        menuItem.visible = false
    })
}

const contextMenu = Menu.buildFromTemplate([
    { id: 1, label: '开机自启动', type: 'normal', visible: autoStart, icon: autoStartOn, click: autoStartChange },
    { id: 2, label: '开机自启动', type: 'normal', visible: !autoStart, icon: autoStartOff, click: autoStartChange },
    { id: 3, label: '退出', type: 'normal', role: 'quit', icon: quit },
])


function createTray(mainWindow) {
    tray = new Tray(trayIcon);
    tray.setToolTip('wallpaper');
    tray.on('click', () => {
        // 打开主窗口
        mainWindow.show()
    });
    tray.setContextMenu(contextMenu);
}

export default createTray
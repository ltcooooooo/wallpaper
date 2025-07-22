import { Tray, Menu, nativeImage } from 'electron'

import trayIconWin from '../../../../resources/tray/tray_win.png?asset'

import autoStartOffIco from '../../../../resources/tray/autoStartOff.png?asset'
import autoStartOnIco from '../../../../resources/tray/autoStartOn.png?asset'
import quitIco from '../../../../resources/tray/quit.png?asset'

const platform =  process.platform
const trayIcon = platform === 'win32' ? trayIconWin : null

const autoStartOff = nativeImage.createFromPath(autoStartOffIco).resize({ width: 16, height: 16 })
const autoStartOn = nativeImage.createFromPath(autoStartOnIco).resize({ width: 16, height: 16 })
const quit = nativeImage.createFromPath(quitIco).resize({ width: 16, height: 16 })

export {
    trayIcon,
    autoStartOff,
    autoStartOn,
    quit
}
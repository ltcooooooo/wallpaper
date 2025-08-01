import { Tray, Menu, nativeImage } from 'electron'

import trayIconImage from '../../../../resources/tray/tray_icon.png?asset'

import autoStartOffIco from '../../../../resources/tray/autoStartOff.png?asset'
import autoStartOnIco from '../../../../resources/tray/autoStartOn.png?asset'
import quitIco from '../../../../resources/tray/quit.png?asset'

const platform =  process.platform

const autoStartOff = nativeImage.createFromPath(autoStartOffIco).resize({ width: 16, height: 16 })
const autoStartOn = nativeImage.createFromPath(autoStartOnIco).resize({ width: 16, height: 16 })
const quit = nativeImage.createFromPath(quitIco).resize({ width: 16, height: 16 })
const traryIconMac = nativeImage.createFromPath(trayIconImage).resize({ width: 16, height: 16 })

// const trayIconMacTemplate = nativeImage.createFromPath(trayIconImage)

const trayIcon = platform === 'win32' ? trayIconImage : traryIconMac
export {
    trayIcon,
    autoStartOff,
    autoStartOn,
    quit
}
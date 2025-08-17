import { Tray, Menu, nativeImage } from 'electron'

import trayIconImage from '../../../../resources/tray/tray_icon.png?asset'

import autoStartOffIco from '../../../../resources/tray/autoStartOff.png?asset'
import autoStartOnIco from '../../../../resources/tray/autoStartOn.png?asset'
import cursorOffIco from '../../../../resources/tray/cursorOff.png?asset'
import cursorOnIco from '../../../../resources/tray/cursorOn.png?asset'
import quitIco from '../../../../resources/tray/quit.png?asset'
import openWinIco from '../../../../resources/tray/openWin.png?asset'

const platform =  process.platform

const autoStartOn = nativeImage.createFromPath(autoStartOnIco).resize({ width: 16, height: 16 })
const autoStartOff = nativeImage.createFromPath(autoStartOffIco).resize({ width: 16, height: 16 })
const cursorOn = nativeImage.createFromPath(cursorOnIco).resize({ width: 16, height: 16 })
const cursorOff = nativeImage.createFromPath(cursorOffIco).resize({ width: 16, height: 16 })
const quit = nativeImage.createFromPath(quitIco).resize({ width: 16, height: 16 })
const trayIconMac = nativeImage.createFromPath(trayIconImage).resize({ width: 16, height: 16 })
const openWin = nativeImage.createFromPath(openWinIco).resize({ width: 16, height: 16 })

// const trayIconMacTemplate = nativeImage.createFromPath(trayIconImage)

const trayIcon = platform === 'win32' ? trayIconImage : trayIconMac
export {
    trayIcon,
    autoStartOff,
    autoStartOn,
    cursorOn,
    cursorOff,
    quit,
    openWin
}
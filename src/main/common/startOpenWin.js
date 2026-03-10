import { configStore } from '../store'
import { setCursorWindows, setLiveWindows } from './window'
export function openCursor() {
    const cursor = configStore.get('settings').cursor
    if(!cursor) return
    const cursorOpen = cursor.open
    const allDisplays = ['fairyDust', 'emoji', 'bubble', 'snowflake', 'character'].includes(cursor.current)
    cursorOpen && setCursorWindows(allDisplays)
}

export function openLive() {
    const { liveWallpaper } = configStore.get('settings')
    liveWallpaper && setLiveWindows()
}


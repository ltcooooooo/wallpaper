import { configStore } from '../store'
import { createCursorWindow } from './window'
function openCursor() {
    const cursor = configStore.get('settings').cursor
    if(!cursor) return
    const cursorOpen = cursor.open
    const allDisplays = ['fairyDust', 'emoji', 'bubble', 'snowflake', 'character'].includes(cursor.current)
    cursorOpen && createCursorWindow(allDisplays)
}

export default openCursor
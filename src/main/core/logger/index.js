import log from 'electron-log'

export default function globalMountElog(){
    global.Elog = log
}

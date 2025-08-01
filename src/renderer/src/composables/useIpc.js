import useSettingStore from '@renderer/store/setting'

export default function useIpc() {
    const { setting } = useSettingStore()
    window.electronAPI.trayChangeStatus(({ name, status }) => {
        console.log('trayChangeStatus', name, status)
        console.log('settingggg', setting)
        switch (name) {
            case '开机自启动':
                setting.autoStart = status
                break
            case '光标效果':
                setting.cursor.open = status
        }
    })
}
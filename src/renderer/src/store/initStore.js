import useSettingsStore from './setting'


export default async function initStore(pinia) {
    const { initSetting } = useSettingsStore(pinia)
    return await initSetting()

}
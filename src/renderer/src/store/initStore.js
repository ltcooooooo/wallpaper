import useFavoritesStore from './favorites'
import useSettingsStore from './setting'


export default function initStore(pinia) {
    const { initSetting } = useSettingsStore(pinia)
    const { initFavoritesList } = useFavoritesStore(pinia)
    return Promise.all([initSetting(), initFavoritesList()])
}
import { defineStore } from 'pinia'
import { reactive, toRaw } from 'vue'
const useFavoritesStore = defineStore('favorites', () => {
    const favoritesList = reactive([])
    
    async function addFavoritesImage(newFavorites) {
        favoritesList.unshift(newFavorites)
        const rawData = toRaw(favoritesList)
        const result = await window.electronAPI.setFavoritesList(rawData)
    }
    
    async function initFavoritesList() {
        const list = await window.electronAPI.getFavoritesList()
        favoritesList.push(...list)
    }
    async function delFavoritesImage(image) {
        const index = favoritesList.findIndex(item => image.imgSrc === item.imgSrc )
        favoritesList.splice(index, 1)
        const rawData = toRaw(favoritesList)
        const result = await window.electronAPI.setFavoritesList(rawData)
    }

    return {
        favoritesList,
        addFavoritesImage,
        initFavoritesList,
        delFavoritesImage
    }
})
export default useFavoritesStore 
import { ref, watch } from 'vue'
import { useBaseList } from './useBaseList'

const isUpdateImageFavorites = ref(false)
const isUpdateVideoFavorites = ref(false)

export {
    isUpdateImageFavorites,
    isUpdateVideoFavorites
}

export function useImageList({ listRef }) {
  const { list: favoritesList, ...rest } = useBaseList({
    listRef,
    fetchData: window.electronAPI.getImageFavorites,
    updateListFlag: isUpdateImageFavorites
  })
  watch(isUpdateImageFavorites, (change) => {
    if (change) {
      rest.updateList()
    }
  })

  return {
    favoritesList,
    ...rest
  }
}

export function useVideoList({ listRef }) {
  const { list: favoritesList, ...rest } = useBaseList({
    listRef,
    fetchData: window.electronAPI.getVideoFavorites,
    updateListFlag: isUpdateVideoFavorites
  })
  watch(isUpdateVideoFavorites, (change) => {
    if (change) {
      rest.updateList()
    }
  })

  return {
    favoritesList,
    ...rest
  }
}
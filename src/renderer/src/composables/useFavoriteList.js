import { ref, watch } from 'vue'
import { useBaseList } from './useBaseList'

const isUpdateImageFavorites = ref(false)

// const isUpdateVideoLocal = ref(false)

export {
    isUpdateImageFavorites,
//   isUpdateVideoLocal
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
  const { list: videoList, ...rest } = useBaseList({
    listRef,
    fetchData: window.electronAPI.getLocalVideoList,
    updateListFlag: isUpdateImageLocal
  })
  watch(isUpdateVideoLocal, (change) => {
    if (change) {
      rest.updateList()
    }
  })

  return {
    videoList,
    ...rest
  }
}
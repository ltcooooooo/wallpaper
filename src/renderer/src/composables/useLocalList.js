import { ref, watch } from 'vue'
import { useBaseList } from './useBaseList'

const isUpdateImageLocal = ref(false)
const isUpdateVideoLocal = ref(false)

export {
  isUpdateImageLocal,
  isUpdateVideoLocal
}

export function useImageList({ listRef }) {
  const { list: imageList, ...rest } = useBaseList({
    listRef,
    fetchData: window.electronAPI.getLocalImageList,
    updateListFlag: isUpdateImageLocal
  })
  watch(isUpdateImageLocal, (change) => {
    if (change) {
      rest.updateList()
    }
  })

  return {
    imageList,
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
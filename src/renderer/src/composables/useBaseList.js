import { ref, reactive, computed } from 'vue'

export function useBaseList({ listRef, fetchData, updateListFlag, notUpdateFlag }) {
  const list = ref([])
  const page = reactive({
    current: 1,
    pageSize: 12,
    total: 0
  })

  const paginationHide = computed(() => page.total <= page.pageSize)

  const pageChange = async (val) => {
    page.current = val
    await updateList()
    listRef?.value?.scrollToTop()
  }
  updateList() // 初始化数据
  async function updateList() {
    try {
      const res = await fetchData({ page: page.current, pageSize: page.pageSize })
      list.value = res.data
      page.total = res.total
      
      if (res.data.length === 0 && page.current > 1) {
        page.current--
        return
      }
      if (notUpdateFlag) return
      updateListFlag.value = false
    } catch (error) {
      console.error('获取列表失败:', error)
    }
  }

  return {
    list,
    page,
    paginationHide,
    pageChange,
    updateList
  }
}
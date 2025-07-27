import { reactive, computed } from 'vue'
import MyElMessage from '../common/MyElMessage'

const wallpaperFilter = reactive({
    options: {
        categories: [
            {
                label: '一般',
                value: 1
            },
            {
                label: '动漫',
                value: 2
            },
            {
                label: '美女',
                value: 3
            },
        ], //110 一般，动漫，美女
        purity: [1, 0, 0], //全年龄，少儿不宜，0
        ratios: {
            landscape: true,
            portrait: false
        }, //横屏，竖屏
        topRange: ['1w', '1M', '3M', '6M', '1y'], //一周，一月，3月，6月，一年
        sorting: [
            {
                label: '热门壁纸',
                value: 'hot'
            },
            {
                label: '随机壁纸',
                value: 'random'
            },
            {
                label: '壁纸排行',
                value: 'toplist'
            }
        ],
        topRange: [
            {
                label: '最近一周',
                value: '1w'
            },
            {
                label: '最近一月',
                value: '1M'
            },
            {
                label: '最近仨月',
                value: '3M'
            },
            {
                label: '最近六月',
                value: '6M'
            },
            {
                label: '最近一年',
                value: '1y'
            }
        ]
    },
    value: {
        categories: [1, 2],
        sorting: 'toplist',
        topRange: '1M',
        ratios: 'landscape',
        purity: '100'
    },
})
const params = reactive(formatParams())

//处理请求参数
function formatParams() {
    const params = { ...wallpaperFilter.value }
    console.log('p', params)
    const categoriesSet = new Set(params.categories)
    const categoriesArr = [0, 0, 0]
    categoriesSet.has(1) && (categoriesArr[0] = 1)
    categoriesSet.has(2) && (categoriesArr[1] = 1)
    categoriesSet.has(3) && (categoriesArr[2] = 1)
    categoriesSet.clear()
    const categoriesStr = categoriesArr.join('')
    params.categories = categoriesStr
    //生成一个英文加字母的6位随机字符串
    if (params.sorting === 'random') params.seed = Math.random().toString(36).substring(2, 8)
    return params
}

export default (init) => {
    const showTopRange = computed(() => wallpaperFilter.value.sorting === 'toplist')
    //壁纸类型至少选一个
    let categoriesValue = null
    function categoriesChange(value) {
        if (value.length !== 0) {
            categoriesValue = value
        } else {
            wallpaperFilter.value.categories = categoriesValue
        }
    }

    function refreshList() {
        const newParams = formatParams()
        for (const key in newParams) {
            params[key] = newParams[key]
        }
        init()
    }
    let clickNum = 0
    let clickTimer = null
    let messageText = ''
    let messageType = ''
    function changePurity() {
        clickNum++
        console.log(clickNum)
        if (clickNum === 5) {
            console.log('切换了', wallpaperFilter.value.purity)
            if (wallpaperFilter.value.purity === '100') {
                wallpaperFilter.value.purity = '010',
                wallpaperFilter.value.categories = [1,2,3]
                messageText = '已切换到颜色模式'
                messageType = 'warning'
            } else {
                wallpaperFilter.value.purity = '100'
                messageText = '已切换到常规模式'
                messageType = 'success'
            }
            MyElMessage({ type: messageType, message: messageText })
            refreshList()
        }
        if (clickTimer) return
        clickTimer = setTimeout(() => {
            clickNum = 0
            clearTimeout(clickTimer)
            clickTimer = null
        }, 1000)
    }
    return { params, showTopRange, wallpaperFilter, categoriesChange, refreshList, formatParams, changePurity }
}

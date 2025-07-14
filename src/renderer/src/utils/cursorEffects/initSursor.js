const initData = {
    open: true,
    current: 'Rainbow',
    cursorType:{
        Rainbow: {
            name: 'Rainbow',
            label: '彩虹',
            options: {
                cursorName: 'rainbowCursor',
                length: 20,
                minLength: 20,
                maxLength: 100,
                size: 3,
                minSize: 1,
                maxSize: 5,
                color: [ 
                    { value: "#FE0000" }, 
                    { value: "#FD8C00" },
                    { value: "#FFE500" },
                    { value: "#119F0B" },
                    { value: "#00ffff" },
                    { value: "#0644B3" },
                    { value: "#C22EDC" }
                ],
                colors: ["#FE0000", "#FD8C00", "#FFE500", "#119F0B", "#00ffff", "#0644B3", "#C22EDC"],
            }
        },
        Clock: {
            name: 'Clock',
            label: '时钟',
            options: {
                cursorName: 'clockCursor',
                dateColor: '#0000ff',
                faceColor: '#000000',
                secondsColor: '#ff0000',
                minutesColor: '#000000',
                hoursColor: '#000000',
                showDate: true
            }
        },
        fairyDust: {
            name: 'fairyDust',
            label: '仙女尘',
            options: {
                cursorName: 'fairyDustCursor',
                dateColor: '#0000ff',
                faceColor: '#000000',
                secondsColor: '#ff0000',
                minutesColor: '#000000',
                hoursColor: '#000000',
            }
        },
        textFlag: {
            name: 'textFlag',
            label: '文字旗标',
            options: {
                cursorName: 'textFlag',
                text: '666, 我是真吊',
                gap: 24,
                textSize: 12,
                minSize: 12,
                maxSize: 50,
                minGap: 12,
                maxGap: 50,
            }
        },
        emoji: {
            name: 'emoji',
            label: '表情',
            options: {
                cursorName: 'emojiCursor',
                emoji: ['🐱','🐷','🐶','🐍','🐮'],
            }
        },
        springyEmoji: {
            name: 'springyEmoji',
            label: '弹性表情',
            options: {
                cursorName: 'springyEmojiCursor',
                emoji: '🐱',
            }
        },
        bubble: {
            name: 'bubble',
            label: '气泡',
            options: {
                cursorName: 'bubbleCursor',
            }
        },
        snowflake: {
            name: 'snowflake',
            label: '雪花',
            options: {
                cursorName: 'snowflakeCursor',
            }
        },
        character: {
            name: 'character',
            label: '字符',
            options: {
                cursorName: 'characterCursor',
                characters: ['6', '6', '6']
            }
        }
    }
}

const initCursor = (setting) => {
    !setting.sursor && (setting.sursor= {})
    const sursor = setting.sursor
    for (const key in initData) {
        console.log('key', key,  sursor[key])
        if (key in sursor) {
            
        }else {
            console.log('sursor里面没有这个key', key)
            sursor[key] = initData[key]
        }
    }
    const cursorType = initData.cursorType
    const localCursorType = sursor.cursorType
    for (const key in cursorType) {
        if (!localCursorType[key]) {
            localCursorType[key] = cursorType[key]
        }
    }
    for (const key in localCursorType) {
        if (!cursorType[key]) {
            delete localCursorType[key]
        }
    }
    // 更新options
    for (const key in cursorType){
        const options = cursorType[key].options
        const localOptions = localCursorType[key].options
        for (const key in options) {
            // 如果json中没有,那就是在initData里面新加的,给添加进josn
            !(key in localOptions) && (localOptions[key] = options[key])
            if(['minLength', 'maxLength', 'minSize', 'maxSize', 'minGap', 'maxGap'].includes(key)){
                // console.log('key:', key)
                localOptions[key] !== options[key] && (localOptions[key] = options[key])
            }
        }
    }
    // console.log(cursorType, localCursorType)
}

export default initCursor
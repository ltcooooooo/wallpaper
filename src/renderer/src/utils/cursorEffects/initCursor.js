const initData = {
    open: false,
    current: 'Rainbow',
    cursorType:{
        Rainbow: {
            name: 'Rainbow',
            label: '彩虹',
            options: {
                cursorName: 'rainbowCursor',
                length: 20,
                size: 3,
				colors: ["#FE0000", "#FD8C00", "#FFE500", "#119F0B", "#00ffff", "#0644B3", "#C22EDC"]
            }
        },
        Clock: {
            name: 'Clock',
            label: '时钟',
            options: {
                cursorName: 'clockCursor',
                dateColor: "#000000",
				faceColor: "#FF6A00",
				secondsColor: "#E30008",
				minutesColor: "#0048E4",
				hoursColor: "#01D6A4",
                showDate: true
            }
        },
        fairyDust: {
            name: 'fairyDust',
            label: '仙女尘',
            options: {
                cursorName: 'fairyDustCursor'
            }
        },
        textFlag: {
            name: 'textFlag',
            label: '文字旗标',
            options: {
                cursorName: 'textFlag',
                text: '666666',
                gap: 24,
                font: '',
                textSize: 21
            }
        },
        emoji: {
            name: 'emoji',
            label: '表情',
            options: {
                cursorName: 'emojiCursor',
                emoji: ['☁️','🌩️','🌧️','🌨️','⛈️'],
            }
        },
        springyEmoji: {
            name: 'springyEmoji',
            label: '弹性表情',
            options: {
                cursorName: 'springyEmojiCursor',
                emoji: '🏀',
            }
        },
        bubble: {
            name: 'bubble',
            label: '气泡',
            options: {
                cursorName: 'bubbleCursor',
                fillColor: '#e6f1f7',
                strokeColor: '#3a92c5'
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
                characters: ['h', 'e', 'l', 'l', 'o'],
                text: 'hello',
                colors: ['#e53935','#5e35b1', '#039be5', '#00897b', '#fb8c00']
            }
        }
    }
}

const initCursor = (setting) => {
    !setting.cursor && (setting.cursor= {})
    const cursor = setting.cursor
    //初始化数据,如果本地中没有这个key就直接赋值为默认值
    for (const key in initData) {
        console.log('key', key,  cursor[key])
        !cursor.hasOwnProperty(key) && (cursor[key] = initData[key])
    }
    // 更新光标类型的数据
    const cursorType = initData.cursorType
    const localCursorType = cursor.cursorType
    // 如果json中有的选项，但是代码中没有，说明是删除配置项，同步到json中
    for (const key in localCursorType) {
        !cursorType.hasOwnProperty(key) && (delete localCursorType[key])
    }
    // 如果json中没有这个选项，说明是在代码中新增的配置项，同步到json中
    for (const key in cursorType) {
        !localCursorType.hasOwnProperty(key) && (localCursorType[key] = cursorType[key])
        // 更新options
        const options = cursorType[key].options
        const localOptions = localCursorType[key].options
        
        for (const key in localOptions) {
            !options.hasOwnProperty(key) && (delete localOptions[key])
        }
        for (const key in options) {
            !localOptions.hasOwnProperty(key) && (localOptions[key] = options[key])
        }
        
    }
    
}

export default initCursor
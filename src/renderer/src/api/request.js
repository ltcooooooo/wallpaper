import axios from 'axios'

const ip = 'http://tianci.run'
const port = 8866
const baseURL = `${ip}:${port}`

const request = axios.create({baseURL})


export function getListApi(page) {
    return request({
        url: "/list",
        params: { page }
    })
}

export function getWallpaper(src) {
    return request({
        url: "/wallpaper",
        params: {
            url: encodeURIComponent(src)
        },
        responseType: 'arraybuffer'
    })
}
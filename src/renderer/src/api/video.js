import request from "./request"

const prefix = '/video'

function getVideoList(params) {
    return request({
        url: `${prefix}/list`,
        method: 'get',
        params
    })
}

export {
    getVideoList
}
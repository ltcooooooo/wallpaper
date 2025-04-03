import request from "./request"

const sitePrefix = '/wallhaven'

function getWallhavenList(params) {
    return request({
        url: `${sitePrefix}/list`,
        method: 'get',
        params
    })
}

export {
    getWallhavenList
}
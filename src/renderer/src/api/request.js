import axios from 'axios'

const baseURL = `http://tianci.run/wallhaven`

const request = axios.create({baseURL})


export function getListApi(page) {
    return request({
        url: "/list",
        params: { page }
    })
}
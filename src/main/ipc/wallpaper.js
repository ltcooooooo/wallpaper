import { ipcMain, BrowserWindow } from "electron";
import chokidar from 'chokidar';
import axios from 'axios'
import wallpaper from 'wallpaper'
import sharp from 'sharp'
import fs from 'fs'
import { configStore } from '../store/index'
import { extname, sep, join } from 'path'
import { imageSizeFromFile } from 'image-size/fromFile'
import debounce from "lodash.debounce";
import { downloadFile } from "../utils/download";
import { insertImageDB, findImageDB, deleteImageDB, getLocalImageListDB } from '../common/db'

function registerWallpaperIpc() {
    ipcMain.handle('use-wallpaper', async (event, imagePath) => {
        try {
            const setWallpaperReslut = await  wallpaper.set(imagePath, { screen: 'main' })
            return Promise.resolve({ success: true, message: '设置壁纸成功' })
        }
        catch (err) {
            return Promise.resolve({ success: false, message: "设置壁纸失败" })
        }
    })
    ipcMain.handle('download-image', async (event, params) => {
        return await downloadImage(params)
    })
    ipcMain.handle('del-local-wallpaper', async (event, path) => {
        try {
            const rmResult = fs.rmSync(path)
            return Promise.resolve({ success: true, message: "删除本地壁纸成功" })
        }
        catch (err) {
            return Promise.resolve({ success: false, message: "删除本地壁纸失败" })
        }
    })
    ipcMain.handle('get-local-image-List', async (event, params) => {
       return await getLocalImageListDB(params)
    })
    ipcMain.handle('get-local-wallpaper', async (event, filePath) => {
        try {
            const imageSize = await imageSizeFromFile(filePath)
            const imgBuffer = await imgToBuffer(filePath)
            const { mtimeMs } = fs.statSync(filePath)
            // console.log(filePath,fs.statSync(filePath))
            const data = { imgBuffer, mtimeMs, imgSrc: filePath, size: `${imageSize.width}x${imageSize.height}` }
            return Promise.resolve({ success: true, data})
        } catch (err) {
            return Promise.resolve({ success: false, message: err.message })
        }
    })
    async function downloadImage(params) {
        try{
            const image = await findImageDB(params)
            if(image) {
                const exists = fs.existsSync(image.savePath)
                if(exists) {
                    return { success: true, message: '文件已存在', savePath: image.savePath }
                }
                else {
                    await deleteImageDB(image.id)
                }
            }
            // 文件名为时间戳加固定5位随机数
            const { imgSrc: url, downloadSavePath } = params
            const timestamp = Date.now()
            const randomNum = Math.floor(Math.random() * 100000)
            const name = `${timestamp}-${randomNum}${extname(params.imgSrc)}`
            const savePath = join(downloadSavePath, name)
    
            await downloadFile(url, savePath)
            await insertImageDB({
                ...params,
                name,
                savePath
            })
            return { success: true, message: '下载成功', savePath }
            }
            catch (err) {
                return { success: false, message: err.message }
            }
    }
    async function imgToBuffer(imgpath) {
        const optimizedBuffer = await sharp(imgpath)
            .resize(400) // 限制宽度400px，高度自动等比缩放
            .jpeg({
                quality: 60, // 适当降低质量
                progressive: true, // 启用渐进式JPEG
                mozjpeg: true // 启用更高效的JPEG编码
            })
            .toBuffer()
        return optimizedBuffer
    }

    function getLocalWallpaper(path) {
        try {
            const validExtensions = ['.jpg', '.png', '.jpeg'];
            const files = fs.readdirSync(path)
            const imgArr = files.filter(file => validExtensions.includes(extname(file).toLowerCase()))
            const images = imgArr.map(file => `${path}${sep}${file}`)
            return Promise.resolve({ success: true, message: "获取本地壁纸成功", images })
        }
        catch (err) {
            console.log('获取本地壁纸失败',err)
            return Promise.resolve({ success: false, message: "获取本地壁纸失败" })
        }
    }
}

export default registerWallpaperIpc
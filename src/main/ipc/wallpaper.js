import { ipcMain } from "electron";
import axios from 'axios'
import wallpaper from 'wallpaper'
import sharp from 'sharp'
import fs from 'fs'
import { extname, sep } from 'path'
import { imageSizeFromFile } from 'image-size/fromFile'

function registerWallpaperIpc() {
    ipcMain.handle('use-wallpaper', async (event, imagePath) => {
        try {
            const setWallpaperReslut = await wallpaper.set(imagePath, { screen: 'main' })
            return Promise.resolve({ success: true, message: '设置壁纸成功' })
        }
        catch (err) {
            return Promise.resolve({ success: false, message: "设置壁纸失败" })
        }
    })
    ipcMain.handle('download-wallpaper', async (event, url, path) => {
        return await downloadWallpaper(url, path)
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
    ipcMain.handle('get-local-wallpaper-List', (event, path) => {
        try {
            const validExtensions = ['.jpg', '.png', '.jpeg'];
            const files = fs.readdirSync(path)
            const imgArr = files.filter(file => validExtensions.includes(extname(file).toLowerCase()))
            const images = imgArr.map(file => `${path}${sep}${file}`)
            return Promise.resolve({ success: true, message: "获取本地壁纸成功", images })
        }
        catch (err) {
            return Promise.resolve({ success: false, message: "获取本地壁纸失败" })
        }
    })
    ipcMain.handle('get-local-wallpaper', async (event, filePath) => {
        try {
            const imageSize = await imageSizeFromFile(filePath)
            const imgBuffer = await imgToBuffer(filePath)
            const { ctimeMs } = fs.statSync(filePath)
            console.log(filePath,fs.statSync(filePath))
            const data = { imgBuffer, ctimeMs, imgSrc: filePath, size: `${imageSize.width}x${imageSize.height}` }
            return Promise.resolve({ success: true, data})
        } catch (err) {
            return Promise.resolve({ success: false, message: err.message })
        }
    })
    async function downloadWallpaper(url, path) {
        const urlSplit = url.split("/")
        const last = urlSplit[urlSplit.length - 1]
        const name = last.replace(/wallhaven-/, '')
        const filePath = path + (/\//.test(path) ? "/" : "\\") + name

        const writer = fs.createWriteStream(filePath);
        try {
            const res = await axios.get(url, {
                responseType: 'stream'
            })
            res.data.pipe(writer);
            return new Promise((resolve, reject) => {
            writer.on('finish', () => {
                resolve({ success: true, message: '下载成功', filePath });
            });
            writer.on('error', (err) => {
                resolve({ success: false, message: '壁纸下载失败: ' + err.message });
                fs.unlink(filePath, () => {}); // 删除未完成的文件
            });
        });
        }
        catch (err) {
            console.log(err)
            return Promise.resolve({ success: false, message: "壁纸下载失败" })
        }
    }
    async function imgToBuffer(imgpath) {
        const optimizedBuffer = await sharp(imgpath)
            .resize(400) // 限制宽度300px，高度自动等比缩放
            .jpeg({
                quality: 60, // 适当降低质量
                progressive: true, // 启用渐进式JPEG
                mozjpeg: true // 启用更高效的JPEG编码
            })
            .toBuffer()
        return optimizedBuffer
    }
}

export default registerWallpaperIpc
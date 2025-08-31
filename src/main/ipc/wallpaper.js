import { ipcMain, BrowserWindow } from "electron";
import chokidar from 'chokidar';
import axios from 'axios'
import wallpaper from 'wallpaper'
import fs from 'fs-extra'
import { configStore } from '../store/index'
import { extname, sep, join } from 'path'
import { downloadFile } from "../utils/download";
import { insertImageDB, findImageDB, deleteImageDB, getLocalImageListDB } from '../dal/repositories/imageLocal'
import { insertVideoDB, findVideoDB, deleteVideoDB, getLocalVideoListDB } from '../dal/repositories/videoLocal'
import { insertImageFavoriteDB, findImageFavoriteDB, deleteImageFavoriteDB, getImageFavoritesDB  } from '../dal/repositories/imageFavorite'

// 下载壁纸
async function downloadWallpaper(params, options) {
    const { url, folderPath, findDB, deleteDB, insertDB } = options
    let savePath;
    try {
        const data = await findDB(params)
        if (data) {
            const exists = fs.existsSync(data.savePath)
            if (exists) {
                return { success: true, message: '文件已存在', savePath: data.savePath, exists: true }
            }
            else {
                await deleteDB(data.id)
            }
        }
        // 文件名为时间戳加固定5位随机数
        const timestamp = Date.now()
        const randomNum = Math.floor(Math.random() * 100000)
        const name = `${timestamp}-${randomNum}${extname(url)}`
        savePath = join(folderPath, name)
        await downloadFile(url, savePath)
        await insertDB({...params, savePath})
        return { success: true, message: '下载成功', savePath }
    }
    catch (err) {
        fs.remove(savePath)
        return { success: false, message: err.message }
    }
}

//删除本地壁纸
async function deleteWallpaper(params, options) {
    const { deleteDB } = options
    try {
        await fs.remove(params.savePath)
        await deleteDB(params.id)
        return { success: true, message: "删除本地壁纸成功" }
    }
    catch (err) {
        return { success: false, message: "删除本地壁纸失败" }
    }
}

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
    //下载
    ipcMain.handle('download-image', async (event, params) => {
        const options = {
            url: params.imgSrc,
            folderPath: params.imageSavePath,
            findDB: findImageDB,
            deleteDB: deleteImageDB,
            insertDB: insertImageDB,
        }
        return await downloadWallpaper(params, options)
    })
    ipcMain.handle('download-video', async (event, params) => {
        const options = {
            url: params.url,
            folderPath: params.videoSavePath,
            findDB: findVideoDB,
            deleteDB: deleteVideoDB,
            insertDB: insertVideoDB,
        }
        return await downloadWallpaper(params, options)
    })
    //删除
    ipcMain.handle('del-local-image', async (event, params) => {
        return deleteWallpaper(params, { deleteDB: deleteImageDB })
    })
    ipcMain.handle('del-local-video', async (event, params) => {
        return deleteWallpaper(params, { deleteDB: deleteVideoDB })
    })
    //获取列表
    ipcMain.handle('get-local-image-List', async (event, params) => {
        return await getLocalImageListDB(params)
    })
    ipcMain.handle('get-local-video-List', async (event, params) => {
        return await getLocalVideoListDB(params)
    })

    //收藏
    ipcMain.handle('add-image-favorite', async (event, params) => {
        try {
            const res =  await insertImageFavoriteDB(params)
            return { success: true, message: '收藏成功' }
        }catch (error) {
            return { success: false, message: '收藏失败' }
        }
    })
    ipcMain.handle('del-image-favorite', async (event, params) => {
        try {
            const res =  await deleteImageFavoriteDB(params)
            return { success: true, message: '取消收藏成功' }
        }catch (error) {
            return { success: false, message: '取消收藏失败' }
        }
    })
    ipcMain.handle('get-image-favorite-status', async (event, params) => {
        try {
            const data = await findImageFavoriteDB(params)
            return { success: true, data }
        }catch (error) {
            return { success: false, message: '取消收藏失败' }
        }
    })
    ipcMain.handle('get-image-avorites', async (event, params) => {
        return await getImageFavoritesDB(params)
    })
}

export default registerWallpaperIpc
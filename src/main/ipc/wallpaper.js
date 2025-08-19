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
    ipcMain.handle('get-local-wallpaper-List', async (event, path) => {
        const result = await getLocalWallpaper(path)
        if (result.success) {
            const win = BrowserWindow.fromWebContents(event.sender)
            const dataPath = configStore.get('settings').dataPath
            const handleChangeFs = debounce((filePath) => {
                console.log(`Image file ${filePath}`);
                getLocalWallpaper(path).then(res => {
                    console.log('send local-wallpaper-changed')
                    win.webContents.send('local-wallpaper-changed', res)
                })
            },500)

            const watcher = chokidar
            .watch(join(dataPath, 'images'), {persistent: false})
            .on('ready', () => {
                watcher
                .on('unlink', handleChangeFs)
                .on('add', handleChangeFs)
            })
            // .on('all', (eventType, path) => {
            //     console.log(`File ${path} has been ${eventType}`);
            // })
            
            // fs.watch(
            //     join(dataPath, 'images'),
            //     {
            //         persistent: false
            //     },
            //     (a,b) =>{console.log('a',a, 'b', b)}
            // )  
            
        }
        return result
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
    async function downloadWallpaper(url, path) {
        const urlSplit = url.split("/")
        const last = urlSplit[urlSplit.length - 1]
        const name = last.replace(/wallhaven-/, '')
        const filePath = path + (/\//.test(path) ? "/" : "\\") + name

        try {
            const res = await axios.get(url, {
                responseType: 'arraybuffer'
            })
            const imageBuffer = Buffer.from(res.data);
            try {
                const result = fs.writeFileSync(filePath, imageBuffer)
                return Promise.resolve({ success: true, message: '下载成功', filePath })
            }
            catch (err) {
                console.log('壁纸下载失败,请检查壁纸文件夹路径', err)
                return Promise.resolve({ success: false, message: '壁纸下载失败,请检查壁纸文件夹路径' })
            }
        }
        catch (err) {
            console.log(err)
            return Promise.resolve({ success: false, message: "壁纸下载失败" })
        }
        // const writer = fs.createWriteStream(filePath);
        // try {
        //     const res = await axios.get(url, {
        //         responseType: 'stream'
        //     })
        //     res.data.pipe(writer);
        //     return new Promise((resolve, reject) => {
        //         writer.on('finish', () => {
        //             resolve({ success: true, message: '下载成功', filePath });
        //         });
        //         writer.on('error', (err) => {
        //             resolve({ success: false, message: '壁纸下载失败: ' + err.message });
        //             fs.unlink(filePath, () => {}); // 删除未完成的文件
        //         });
        //     });
        // }
        // catch (err) {
        //     console.log(err)
        //     return Promise.resolve({ success: false, message: "壁纸下载失败" })
        // }
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
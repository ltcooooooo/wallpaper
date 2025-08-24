import axios from 'axios'
import fs from 'fs-extra'
export function downloadFile(url, savePath) {
    return new Promise(async (resolve, reject) => {
        const writer = fs.createWriteStream(savePath);
        const res = await axios.get(url, {
            responseType: 'stream'
        })
        res.data.pipe(writer);
        writer.on('finish', () => {
            resolve({ savePath });
        });
        writer.on('error', (err) => {
            fs.remove(savePath, () => { });
            reject({ message: '壁纸下载失败: ' + err.message });
        });
    })
}
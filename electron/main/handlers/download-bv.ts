import { ipcMain } from 'electron'
import { Channel } from '../enums/channel'

// 下载 bilibili 视频，封面，等内容
export function registerDownloadBVHandler() {
  ipcMain.handle(Channel.DownloadBV, async (_event, params: MainProcess.DownloadBVParams) => {
    console.log('params', params)
  })
}

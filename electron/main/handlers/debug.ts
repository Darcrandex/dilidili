import { EChannel } from '@electron/enums'
import { ipcMain } from 'electron'
import ffmpegPath from 'ffmpeg-static'
import FfmpegCommand from 'fluent-ffmpeg'

export function registerDebugHandler() {
  ipcMain.handle(EChannel.Debug, async () => {
    const ffmpeg = await debugFfmpeg()
    return { ffmpeg }
  })
}

function debugFfmpeg() {
  return new Promise<string>((resolve) => {
    // 打包之后，ffmpeg 的路径永远都是错误的
    if (ffmpegPath) {
      const command = FfmpegCommand()
      command.setFfmpegPath(ffmpegPath)
      command.getAvailableEncoders((err, encoders) => {
        if (err) {
          resolve('ffmpeg api 不可用')
        } else {
          resolve(Object.keys(encoders).join('\n'))
        }
      })
    } else {
      resolve('未找到 ffmpeg')
    }
  })
}

import { ipcMain } from 'electron'
import ffmpegPath from 'ffmpeg-static'
import FfmpegCommand from 'fluent-ffmpeg'
import { Channel } from '../enums/channel'

export function registerDebugHandler() {
  ipcMain.handle(Channel.Debug, async () => {
    const ffmpeg = await debugFfmpeg()
    return { ffmpeg }
  })
}

function debugFfmpeg() {
  return new Promise<string>((resolve) => {
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

      resolve(ffmpegPath)
    } else {
      resolve('未找到 ffmpeg')
    }
  })
}

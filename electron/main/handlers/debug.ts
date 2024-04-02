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

import { EChannel } from '@electron/enums'
import { app, ipcMain } from 'electron'
import ffmpegPath from 'ffmpeg-static'
import FfmpegCommand from 'fluent-ffmpeg'
import path from 'node:path'

export function registerDebugHandler() {
  ipcMain.handle(EChannel.Debug, async () => {
    // app 执行文件所在的目录
    // 其实就是 Resources
    const appRootDir = path.dirname(app.getAppPath())
    const ffmpeg = await debugFfmpeg()
    return { appRootDir, ffmpeg }
  })
}

function debugFfmpeg() {
  return new Promise<string>((resolve) => {
    const appPath = app.getAppPath()
    const my_ffmpegPath = path.join(appPath, 'resources', 'test-file.json')

    if (ffmpegPath) {
      // 打包之后路径需要调整
      // 打包时，ffmpeg 下载的是当前打包的机器对应的二进制文件
      // 不是 app 目标平台对应的二进制文件
      // 所有路径修改正确，但文件是错误的
      const binaryPath = ffmpegPath.replace('app.asar', 'app.asar.unpacked')

      const command = FfmpegCommand()
      command.setFfmpegPath(binaryPath)
      command.getAvailableEncoders((err, encoders) => {
        if (err || !encoders) {
          resolve(`ffmpeg 路径匹配错误：${binaryPath}`)
        } else {
          resolve(JSON.stringify({ binaryPath, my_ffmpegPath }))
        }
      })
    } else {
      resolve('未找到 ffmpeg')
    }
  })
}

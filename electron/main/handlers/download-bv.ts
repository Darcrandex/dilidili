import { EChannel, ECommon, EStorage } from '@electron/enums'
import { ipcMain } from 'electron'
import ffmpegPath from 'ffmpeg-static'
import FfmpegCommand from 'fluent-ffmpeg'
import got from 'got'
import { createWriteStream, mkdirSync, promises, writeFile } from 'node:fs'
import path from 'node:path'
import { pipeline as streamPipeline } from 'node:stream/promises'
import userAgents from 'user-agents'
import { globalStore } from '../global-store'
import { sleep, uuid } from '../utils/common'

// 下载 bilibili 视频，封面，等内容
export function registerDownloadBVHandler() {
  ipcMain.handle(EChannel.DownloadBV, async (_event, params: MainProcess.DownloadBVParams) => {
    // 存放视频的根目录
    const rootDir = globalStore.get(EStorage.RootDir) as string
    // BV视频文件夹
    const folderDir = path.resolve(rootDir, params.ownerId, params.bvid)
    // 视频文件
    const outputFileName = [params.bvid, params.page, params.quality].join('_')

    // 创建文件夹
    mkdirSync(folderDir, { recursive: true })

    // 下载的临时文件
    const id = uuid()
    const videoTemp = path.resolve(folderDir, `${id}_video.m4s`)
    const audioTemp = path.resolve(folderDir, `${id}_audio.m4s`)
    const coverImagePath = path.resolve(folderDir, `${params.bvid}-cover.jpg`)
    const videoInfoPath = path.resolve(folderDir, `${params.bvid}-info.json`)
    const outputPath = path.resolve(folderDir, `${outputFileName}.mp4`)

    // 服务端有请求频次限制
    await downloadFile(params.videoDownloadUrl, videoTemp)
    await sleep(200 + Math.random() * 1000)
    await downloadFile(params.audioDownloadUrl, audioTemp)
    await sleep(200 + Math.random() * 1000)
    await downloadFile(params.coverImageUrl, coverImagePath)
    await saveToJSONFile(videoInfoPath, params.videoInfo)

    // 音视频混流
    try {
      await mixing(videoTemp, audioTemp, outputPath)
    } catch (error) {
      console.error(error)
      throw error
    } finally {
      // 删除临时文件
      await promises.unlink(videoTemp)
      await promises.unlink(audioTemp)
    }
  })
}

async function downloadFile(url = '', filePath = '') {
  return new Promise<void>((resolve, reject) => {
    streamPipeline(
      got
        .stream(url, {
          headers: {
            'User-Agent': new userAgents().toString(),
            referer: ECommon.Referer,
            cookie: `${EStorage.Session}=${globalStore.get(EStorage.Session)}`,
          },
        })
        .on('error', reject)
        .on('finish', () => resolve()),

      createWriteStream(filePath),
    )
  })
}

async function mixing(videoPath = '', audioPath = '', outputPath = '') {
  return new Promise<void>((resolve, reject) => {
    if (!ffmpegPath) {
      return reject('ffmpeg api 不可用')
    }

    const binaryPath = ffmpegPath.replace('app.asar', 'app.asar.unpacked')

    FfmpegCommand()
      .setFfmpegPath(binaryPath)
      .input(videoPath)
      .input(audioPath)
      .outputOptions(['-c:v copy', '-c:a copy'])
      .on('error', reject)
      .on('end', () => resolve())
      .save(outputPath)
  })
}

function saveToJSONFile(filePath: string, data: any): Promise<void> {
  return new Promise((resolve, reject) => {
    // 将嵌套对象转换为 JSON 格式的字符串
    const jsonData = JSON.stringify(data)

    // 将 JSON 字符串写入到文件中
    writeFile(filePath, jsonData, (err) => {
      if (err) {
        reject(err)
        return
      }
      resolve()
    })
  })
}

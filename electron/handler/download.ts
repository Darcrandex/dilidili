// 下载视频
// 创建文件夹
// 合成视频
// 下载封面

import { globalStore } from '@electron/common/global-store'
import { REFERER, STORAGE_ROOT_PATH_KEY, STORAGE_SESSION_KEY } from '@electron/const'
import { HandleChannel } from '@electron/enums'
import { sleep, uuid } from '@electron/utils'
import { ipcMain } from 'electron'
import ffmpegPath from 'ffmpeg-static'
import got from 'got'
import { spawn } from 'node:child_process'
import { createWriteStream, existsSync, mkdirSync, promises } from 'node:fs'
import path from 'node:path'
import { pipeline as streamPipeline } from 'node:stream/promises'
import userAgents from 'user-agents'

// @ts-ignore

export async function registerDownloadHandler() {
  ipcMain.handle(HandleChannel.DownloadBV, async (_event, params: VideoDownloadParams) => {
    // 视频文件保存的根目录
    const dataRootPath = globalStore.get(STORAGE_ROOT_PATH_KEY)
    const folderPath = path.resolve(dataRootPath, params.ownerId, params.bvid)
    const outputFileName = [params.bvid, params.page, params.quality].join('_')

    if (!existsSync(folderPath)) {
      mkdirSync(folderPath, { recursive: true })
      console.log('文件夹已创建')
    } else {
      console.log('文件夹已存在')
    }

    // 下载的临时文件
    const id = uuid()
    const videoTemp = path.resolve(folderPath, `${outputFileName}-video_${id}.m4s`)
    const audioTemp = path.resolve(folderPath, `${outputFileName}-audio_${id}.m4s`)
    const coverImagePath = path.resolve(folderPath, `${params.bvid}-cover.jpg`)
    const outputPath = path.resolve(folderPath, `${outputFileName}.mp4`)

    await downloadFile(params.videoDownloadUrl, videoTemp)
    await sleep(Math.random() * 2000) // 不能连续下载
    await downloadFile(params.audioDownloadUrl, audioTemp)
    await sleep(Math.random() * 2000)
    await downloadFile(params.coverImageUrl, coverImagePath)

    console.log('文件下载完成')

    await mergeVideo(videoTemp, audioTemp, outputPath)
    console.log('视频合并完成')

    try {
      // 删除临时文件
      await sleep(1000)
      await promises.unlink(videoTemp)
      await promises.unlink(audioTemp)
    } catch (err) {
      console.log('删除临时文件失败', err)
    }

    return outputPath
  })
}

async function downloadFile(url = '', filePath = '') {
  const ua = new userAgents({ deviceCategory: 'desktop' })
  const SESSDATA = globalStore.get(STORAGE_SESSION_KEY)

  await streamPipeline(
    got
      .stream(url, {
        headers: {
          'user-agent': ua.toString(),
          referer: REFERER,
          cookie: `SESSDATA=${SESSDATA}`,
        },
      })
      .on('error', () => {
        console.log('下载失败')
      })
      .on('finish', () => {
        console.log('下载完成')
      }),
    createWriteStream(filePath)
  )
}

async function mergeVideo(videoPath: string, audioPath: string, outputPath: string) {
  const args = ['-i', videoPath, '-i', audioPath, '-c:v', 'copy', '-c:a', 'copy', '-f', 'mp4', outputPath]

  return new Promise<void>((resolve, reject) => {
    console.log('mergeVideo 开始合并', ffmpegPath)

    if (!ffmpegPath) {
      return reject('没有找到ffmpeg')
    }

    const ffmpegProcess = spawn(ffmpegPath?.replace('app.asar', 'app.asar.unpacked'), args)

    ffmpegProcess.on('error', (err) => {
      console.log('合成失败', err)
      reject(err)
    })

    ffmpegProcess.on('close', () => {
      console.log('合并成功 退出 ffmpeg 进程')
      resolve()
    })
  })
}

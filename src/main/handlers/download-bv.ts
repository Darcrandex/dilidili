import { BrowserWindow, ipcMain } from 'electron'
import ffmpegPath from 'ffmpeg-static'
import FfmpegCommand from 'fluent-ffmpeg'
import got from 'got'
import { createWriteStream, mkdirSync, promises, writeFile } from 'node:fs'
import path from 'node:path'
import { pipeline as streamPipeline } from 'node:stream/promises'
import userAgents from 'user-agents'
import { EChannel, ECommon, EStorage, ETaskStatus } from '../enums'
import { globalStore } from '../global-store'
import { uuid } from '../utils/common'

// 下载 bilibili 视频，封面，等内容
export function registerDownloadBVHandler(): void {
  ipcMain.handle(EChannel.DownloadBV, async (_event, params: MainProcess.DownloadBVParams) => {
    // 存放视频的根目录
    const rootDir = globalStore.get(EStorage.RootDir) as string
    // BV视频文件夹
    const folderDir = path.resolve(rootDir, params.ownerId, params.bvid)
    // 视频文件
    const outputFileName = [params.bvid, params.page, params.quality].join('_')

    // 创建文件夹
    mkdirSync(folderDir, { recursive: true })

    const id = params.id || uuid()
    // 下载的临时文件
    const videoTemp = path.resolve(folderDir, `${id}_video.m4s`)
    const audioTemp = path.resolve(folderDir, `${id}_audio.m4s`)

    const coverImagePath = path.resolve(folderDir, `${params.bvid}-cover.jpg`)
    const videoInfoPath = path.resolve(folderDir, `${params.bvid}-info.json`)
    const outputPath = path.resolve(folderDir, `${outputFileName}.mp4`)

    // 任务开始
    const taskItem: MainProcess.DownloadTask = {
      id,
      createdAt: Date.now(),
      status: ETaskStatus.Downloading,
      params,
      folderDir
    }

    if (params.id) {
      // 重新下载
      taskModel.update(params.id, { ...taskItem, status: ETaskStatus.Downloading })
    } else {
      taskModel.create(taskItem)
    }

    try {
      await downloadFile(params.videoDownloadUrl, videoTemp)
      await stepDelay()
      await downloadFile(params.audioDownloadUrl, audioTemp)
      await stepDelay()
      await downloadFile(params.coverImageUrl, coverImagePath)
      await stepDelay()
      await saveToJSONFile(videoInfoPath, params.videoInfo)
      taskModel.update(taskItem.id, { status: ETaskStatus.Mixing })

      // 音视频混流
      await mixing(videoTemp, audioTemp, outputPath)

      // 任务完成
      taskModel.update(taskItem.id, { status: ETaskStatus.Finished })
    } catch (error) {
      console.error('任务失败\n', { videoTemp, audioTemp, outputPath }, error)

      // 任务失败
      taskModel.update(taskItem.id, { status: ETaskStatus.Failed })
    } finally {
      // 删除临时文件
      await stepDelay()
      promises.unlink(videoTemp)
      promises.unlink(audioTemp)
    }
  })
}

async function downloadFile(url = '', filePath = ''): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    streamPipeline(
      got
        .stream(url, {
          headers: {
            'User-Agent': new userAgents().toString(),
            referer: ECommon.Referer,
            cookie: `${EStorage.Session}=${globalStore.get(EStorage.Session)}`
          }
        })
        .on('error', reject),

      createWriteStream(filePath)
    )
      .then(() => resolve())
      .catch(reject)
  })
}

async function mixing(videoPath = '', audioPath = '', outputPath = ''): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    if (!ffmpegPath) {
      return reject('ffmpeg api 不可用')
    }

    const binaryPath = ffmpegPath.replace('app.asar', 'app.asar.unpacked')

    FfmpegCommand()
      .setFfmpegPath(binaryPath)
      .input(videoPath)
      .input(audioPath)
      .videoCodec('copy')
      .audioCodec('copy')
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

// 临时方案
// 任务管理模块
const taskModel = {
  create: async (data: MainProcess.DownloadTask): Promise<void> => {
    const prevTasks = globalStore.get(EStorage.DownloadTasks)
    globalStore.set(EStorage.DownloadTasks, [...prevTasks, data])
    BrowserWindow.getAllWindows().forEach((win) => {
      win.webContents.send(EChannel.StoreUpdated, EStorage.DownloadTasks)
    })
  },

  update: async (id: string, data: Partial<MainProcess.DownloadTask>): Promise<void> => {
    const prevTasks = globalStore.get(EStorage.DownloadTasks)
    globalStore.set(
      EStorage.DownloadTasks,
      prevTasks.map((task) => (task.id === id ? { ...task, ...data } : task))
    )
    BrowserWindow.getAllWindows().forEach((win) => {
      win.webContents.send(EChannel.StoreUpdated, EStorage.DownloadTasks)
    })
  },

  remove: async (taskId: string): Promise<void> => {
    const prevTasks = globalStore.get(EStorage.DownloadTasks)
    globalStore.set(
      EStorage.DownloadTasks,
      prevTasks.filter((task) => task.id !== taskId)
    )
    BrowserWindow.getAllWindows().forEach((win) => {
      win.webContents.send(EChannel.StoreUpdated, EStorage.DownloadTasks)
    })
  },

  removeAll: async (): Promise<void> => {
    globalStore.set(EStorage.DownloadTasks, [])
    BrowserWindow.getAllWindows().forEach((win) => {
      win.webContents.send(EChannel.StoreUpdated, EStorage.DownloadTasks)
    })
  }
}

const stepDelay = async (delay: number = 100): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, delay + Math.random() * 200))

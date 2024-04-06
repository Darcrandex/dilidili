import { EChannel, EStorage } from '@electron/enums'
import { ipcMain } from 'electron'
import fs from 'node:fs'
import path from 'node:path'
import { globalStore } from '../global-store'
import { getDirTree } from './read-dir'

// 读取视频数据根目录
// 将视频信息按照文件夹结构输出，用于展示
export function registerBvInfoHandler() {
  ipcMain.handle(EChannel.GetBVInfo, async () => {
    const rootDir = globalStore.get(EStorage.RootDir) as string
    const tree = await getDirTree(rootDir)

    // 过滤 mid 格式的文件夹
    const midRegex = /^\d{5,}$/
    const midFolders = tree?.children?.filter((f) => midRegex.test(f.name))

    const treeWithInfo: MainProcess.BVTreeWithInfo[] = midFolders.map((m) => {
      return {
        mid: m.name,
        dir: path.join(rootDir, m.name),

        bvs: m.children
          ?.filter((f) => f.name.startsWith('BV'))
          ?.map((b) => {
            let info: MainProcess.VideoInfoSchema | null = null
            try {
              const str = fs.readFileSync(path.join(rootDir, m.name, b.name, b.name + '-info.json'), 'utf-8')
              info = JSON.parse(str)
            } catch {
              console.error('视频信息没有找到或解析失败')
            }

            const videoFiles = fs.readdirSync(path.join(rootDir, m.name, b.name)).filter((f) => f.endsWith('.mp4'))

            const localInfo = {
              coverPath: path.join(rootDir, m.name, b.name, `${b.name}-cover.jpg`),
              videoPaths: videoFiles,
            }

            return {
              bvid: b.name,
              dir: path.join(rootDir, m.name, b.name),
              info,
              localInfo,
            }
          }),
      }
    })

    return treeWithInfo
  })
}

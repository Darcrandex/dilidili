import { ipcMain } from 'electron'
import fs from 'node:fs'
import path from 'node:path'
import { EChannel } from '../enums'

export function registerReadDirHandler() {
  ipcMain.handle(EChannel.ReadDir, async (_event, path: string) => {
    return getDirTree(path)
  })

  // 读取文件内容
  ipcMain.handle(EChannel.ReadFile, async (_event, path: string) => {
    return fs.readFileSync(path, 'utf-8')
  })
}

// 递归遍历目录并构建树状结构
export function getDirTree(dirPath: string): Promise<MainProcess.FileNode> {
  return new Promise((resolve, reject) => {
    fs.stat(dirPath, (err, stat) => {
      if (err) {
        reject(err) // 处理目录不存在或者其他错误情况
        return
      }

      if (stat.isFile()) {
        // 如果是文件，直接返回文件名
        resolve({ name: path.basename(dirPath), children: [] })
      } else if (stat.isDirectory()) {
        // 如果是文件夹，读取其下的文件和文件夹，并递归构建树状结构
        fs.readdir(dirPath, (err, files) => {
          if (err) {
            reject(err) // 处理读取目录内容错误
            return
          }

          Promise.all(files.map((file) => getDirTree(path.join(dirPath, file))))
            .then((children) => {
              resolve({
                name: path.basename(dirPath),
                children: children
              })
            })
            .catch(reject)
        })
      }
    })
  })
}

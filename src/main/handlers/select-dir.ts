import { dialog, ipcMain } from 'electron'
import { EChannel } from '../enums'

// 选择文件夹
export function registerSelectDirHandler() {
  ipcMain.handle(EChannel.SelectDir, async () => {
    const res = await dialog.showOpenDialog({ properties: ['openDirectory'] })

    if (!res.canceled && res.filePaths.length > 0) {
      return res.filePaths[0]
    }

    return undefined
  })
}

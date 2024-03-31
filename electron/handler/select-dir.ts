import { HandleChannel } from '@electron/enums'
import { dialog, ipcMain } from 'electron'

export function registerSelectDirHandler() {
  ipcMain.handle(HandleChannel.SelectDir, async () => {
    let selectedDir: string | undefined

    try {
      const res = await dialog.showOpenDialog({
        title: '选择文件夹',
        properties: ['openDirectory'],
      })

      if (!res.canceled && res.filePaths.length > 0) {
        selectedDir = res.filePaths[0]
      }
    } catch (error) {
      console.log(error)
    }

    return selectedDir
  })
}

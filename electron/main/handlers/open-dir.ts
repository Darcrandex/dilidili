import { EChannel } from '@electron/enums'
import { ipcMain, shell } from 'electron'

export function registerOpenDirHandler() {
  ipcMain.handle(EChannel.OpenDir, async (_event, dirPath: string) => {
    shell.openPath(dirPath)
  })
}

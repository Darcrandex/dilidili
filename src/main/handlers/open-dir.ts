import { ipcMain, shell } from 'electron'
import { EChannel } from '../enums'

export function registerOpenDirHandler() {
  ipcMain.handle(EChannel.OpenDir, async (_event, dirPath: string) => {
    shell.openPath(dirPath)
  })
}

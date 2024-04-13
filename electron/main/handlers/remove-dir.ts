import { EChannel } from '@electron/enums'
import { ipcMain } from 'electron'
import fs from 'node:fs'

export function registerRemoveDirHandler() {
  ipcMain.handle(EChannel.RemoveDir, async (_, path) => {
    return fs.rmSync(path, { recursive: true, force: true })
  })
}

import { ipcMain } from 'electron'
import fs from 'node:fs'
import { EChannel } from '../enums'

export function registerRemoveDirHandler() {
  ipcMain.handle(EChannel.RemoveDir, async (_, path) => {
    return fs.rmSync(path, { recursive: true, force: true })
  })
}

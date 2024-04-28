import { ipcMain, shell } from 'electron'
import { EChannel } from '../enums'

export function registerOpenVideoHandler() {
  ipcMain.handle(EChannel.OpenVideoInSystemPlayer, async (_event, url: string) => {
    console.log('main open video', url)

    shell.openPath(url)
  })
}

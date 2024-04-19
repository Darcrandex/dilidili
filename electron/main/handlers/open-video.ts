import { EChannel } from '@electron/enums'
import { ipcMain, shell } from 'electron'

export function registerOpenVideoHandler() {
  ipcMain.handle(EChannel.OpenVideoInSystemPlayer, async (_event, url: string) => {
    console.log('main open video', url)

    shell.openPath(url)
  })
}

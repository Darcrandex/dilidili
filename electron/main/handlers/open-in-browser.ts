import { EChannel } from '@electron/enums'
import { ipcMain, shell } from 'electron'

export function registerOpenInBrowserHandler() {
  // 使用系统浏览器打开链接
  ipcMain.handle(EChannel.OpenInBrowser, async (_event, url: string) => {
    shell.openExternal(url)
  })
}

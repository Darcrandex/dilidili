import { ipcMain, shell } from 'electron'
import { EChannel } from '../enums'

export function registerOpenInBrowserHandler() {
  // 使用系统浏览器打开链接
  ipcMain.handle(EChannel.OpenInBrowser, async (_event, url: string) => {
    shell.openExternal(url)
  })
}

import { BrowserWindow, ipcMain } from 'electron'
import { WindowControl } from '../enums'

export function registerWindowControlHandler() {
  ipcMain.handle(WindowControl.GetIsMaximized, async () => {
    const win = BrowserWindow.getFocusedWindow()
    if (win) {
      return win.isMaximized()
    } else {
      return false
    }
  })

  ipcMain.handle(WindowControl.ToggleMaximize, async () => {
    const win = BrowserWindow.getFocusedWindow()
    if (win) {
      win.isMaximized() ? win.unmaximize() : win.maximize()
    }
  })

  ipcMain.handle(WindowControl.Minimize, async () => {
    const win = BrowserWindow.getFocusedWindow()
    if (win) {
      win.minimize()
    }
  })

  ipcMain.handle(WindowControl.Close, async () => {
    const win = BrowserWindow.getFocusedWindow()
    if (win) {
      win.close()
    }
  })
}

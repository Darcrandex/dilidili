import { electronApp, is, optimizer } from '@electron-toolkit/utils'
import { BrowserWindow, app, ipcMain, shell } from 'electron'
import { join } from 'path'

import { registerBvInfoHandler } from './handlers/bv-info'
import { registerDebugHandler } from './handlers/debug'
import { registerDownloadBVHandler } from './handlers/download-bv'
import { registerFetchHandler } from './handlers/fetch'
import { registerOpenDirHandler } from './handlers/open-dir'
import { registerOpenInBrowserHandler } from './handlers/open-in-browser'
import { registerOpenVideoHandler } from './handlers/open-video'
import { registerReadDirHandler } from './handlers/read-dir'
import { registerRemoveDirHandler } from './handlers/remove-dir'
import { registerSelectDirHandler } from './handlers/select-dir'
import { registerStorageHandler } from './handlers/storage'
import { registerWindowControlHandler } from './handlers/win-ctl'

function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    frame: false, // 直接隐藏顶部标题栏
    autoHideMenuBar: true,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }

  registerDebugHandler()
  registerFetchHandler()
  registerSelectDirHandler()
  registerStorageHandler()
  registerDownloadBVHandler()
  registerReadDirHandler()
  registerBvInfoHandler()
  registerOpenDirHandler()
  registerOpenInBrowserHandler()
  registerWindowControlHandler()
  registerRemoveDirHandler()
  registerOpenVideoHandler()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC test
  ipcMain.on('ping', () => console.log('pong'))

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.

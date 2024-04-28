import { app } from 'electron'
import Store from 'electron-store'
import { EStorage } from './enums'

export const globalStore = new Store({
  name: 'bilibili-store',

  defaults: {
    [EStorage.Session]: '',
    [EStorage.RootDir]: app.getPath('videos'),
    [EStorage.DownloadTasks]: [] as MainProcess.DownloadTask[]
  }
})

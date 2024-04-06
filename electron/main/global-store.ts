import { EStorage } from '@electron/enums'
import { app } from 'electron'
import Store from 'electron-store'

export const globalStore = new Store({
  name: 'bilibili-store',

  defaults: {
    [EStorage.Session]: '',
    [EStorage.RootDir]: app.getPath('videos'),

    [EStorage.DownloadTasks]: [] as MainProcess.DownloadTask[],
  },
})

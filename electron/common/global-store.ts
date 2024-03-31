import { FILE_ROOT_PATH_NAME, STORAGE_ROOT_PATH_KEY, STORAGE_SESSION_KEY } from '@electron/const'
import { app } from 'electron'
import Store from 'electron-store'

export const globalStore = new Store({
  name: 'global-store',
  clearInvalidConfig: true,
  defaults: {
    [STORAGE_SESSION_KEY]: '',
    [STORAGE_ROOT_PATH_KEY]: app.getPath(FILE_ROOT_PATH_NAME),
  },
})

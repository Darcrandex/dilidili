import { EChannel } from '@electron/enums'
import { ipcMain } from 'electron'
import { globalStore } from '../global-store'

// 渲染进程可以管理 electron-store
export function registerStorageHandler() {
  ipcMain.handle(EChannel.SetStore, (_, values?: Record<string, any>) => {
    if (values) {
      const prev = globalStore.store
      globalStore.set({ ...prev, ...values })
    }
  })

  ipcMain.handle(EChannel.GetStore, (_, key) => {
    return globalStore.get(key)
  })

  ipcMain.handle(EChannel.RemoveStore, (_, key) => {
    globalStore.delete(key)
  })

  ipcMain.handle(EChannel.ClearStore, () => {
    globalStore.clear()
  })
}

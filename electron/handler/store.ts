import { globalStore } from '@electron/common/global-store'
import { HandleChannel } from '@electron/enums'
import { ipcMain } from 'electron'

export function regsterStoreHandler() {
  ipcMain.handle(HandleChannel.SetStore, (_event, data?: Record<string, any>) => {
    for (const key in data) {
      globalStore.set(key, data[key])
    }
  })

  ipcMain.handle(HandleChannel.GetStore, (_event, key?: string) => {
    return key ? globalStore.get(key) : undefined
  })

  ipcMain.handle(HandleChannel.RemoveStore, (_event, key?: string) => {
    if (key) globalStore.delete(key as any)
  })

  ipcMain.handle(HandleChannel.ClearStore, () => {
    globalStore.clear()
  })

  ipcMain.handle(HandleChannel.GetAllStore, () => {
    return globalStore.store
  })
}

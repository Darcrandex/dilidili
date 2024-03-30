import { globalStore } from '@electron/common/global-store'
import { HandleChannel } from '@electron/enums'
import { ipcMain } from 'electron'

export function regsterStoreHandler() {
  ipcMain.handle(HandleChannel.SetStore, async (_event, data?: Record<string, any>) => {
    for (const key in data) {
      globalStore.set(key, data[key])
    }
  })

  ipcMain.handle(HandleChannel.GetStore, async (_event, key?: string) => {
    return key ? globalStore.get(key) : undefined
  })

  ipcMain.handle(HandleChannel.RemoveStore, async (_event, key?: string) => {
    if (key) globalStore.delete(key)
  })

  ipcMain.handle(HandleChannel.ClearStore, async () => {
    globalStore.clear()
  })
}

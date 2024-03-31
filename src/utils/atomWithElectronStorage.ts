import { HandleChannel } from '@electron/enums'
import { atomWithStorage } from 'jotai/utils'

// atomWithStorage 的 storage 适配器默认使用 window.localStorage
// 实现一个基于 electron-storage 的 storage 适配器
const electronStorage = {
  getItem(key: string, initialValue: any) {
    return window.ipcRenderer.invoke(HandleChannel.GetStore, key) || initialValue
  },
  setItem(key: string, newValue: any) {
    return window.ipcRenderer.invoke(HandleChannel.SetStore, { [key]: newValue })
  },
  removeItem(key: string) {
    return window.ipcRenderer.invoke(HandleChannel.RemoveStore, key)
  },
}

export function atomWithElectronStorage<T = any>(key: string, initialValue: T) {
  return atomWithStorage<T>(key, initialValue, electronStorage)
}

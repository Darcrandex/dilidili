// atomWithStorage 默认使用 window.localStorage
// 现在需要实现一个基于 electron-store 读写的 storage

import { EChannel } from '@electron/enums'
import { atomWithStorage } from 'jotai/utils'
import { AsyncStorage } from 'jotai/vanilla/utils/atomWithStorage'

class ElectronStorage<T> implements AsyncStorage<T> {
  async getItem(key: string, initialValue: T) {
    const res: T = await window.ipcRenderer.invoke(EChannel.GetStore, key)
    return res || initialValue
  }

  async setItem(key: string, newValue: T): Promise<void> {
    return window.ipcRenderer.invoke(EChannel.SetStore, { [key]: newValue })
  }

  async removeItem(key: string): Promise<void> {
    return window.ipcRenderer.invoke(EChannel.RemoveStore, key)
  }
}

export function atomWithElectronStore<T>(key: string, defaultValue: T) {
  const store = new ElectronStorage<T>()
  return atomWithStorage(key, defaultValue, store)
}

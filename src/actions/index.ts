// 定义 ipc 功能列表，为了规范接口
// 将所有使用  window.ipcRenderer.invoke 的方法都放在这里

import { EChannel, EStorage } from '@electron/enums'

export const ipcActions = {
  // 选择文件夹
  selectFolderDir: async () => {
    const res: string | undefined = await window.ipcRenderer.invoke(EChannel.SelectDir)
    return res
  },

  // 打开文件夹
  openFolder: async (path: string) => {
    await window.ipcRenderer.invoke(EChannel.OpenDir, path)
  },

  // 删除文件夹
  deleteFolder: async (path: string) => {
    await window.ipcRenderer.invoke(EChannel.RemoveDir, path)
  },

  // 使用默认浏览器打开指定的网址
  openInBrowser: async (url: string) => {
    await window.ipcRenderer.invoke(EChannel.OpenInBrowser, url)
  },

  // 使用默认视频播放器打开指定的视频
  openVideo: async (path: string) => {
    await window.ipcRenderer.invoke(EChannel.OpenVideoInSystemPlayer, path)
  },

  // 订阅任务列表的更新事件
  subscribeTasksStatus: (listener?: (...args: any[]) => void) => {
    const callback = (event?: any, storeKey?: string) => {
      if (storeKey === EStorage.DownloadTasks) {
        console.log('subscribeTasksStatus')

        listener?.()
      }
    }

    window.ipcRenderer.on(EChannel.StoreUpdated, callback)

    // unsubscribe
    return () => {
      window.ipcRenderer.off(EChannel.StoreUpdated, callback)
    }
  },
}

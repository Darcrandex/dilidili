// 定义 ipc 功能列表，为了规范接口
// 将所有使用  window.ipcRenderer.invoke 的方法都放在这里

import { EChannel } from '@electron/enums'

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
}

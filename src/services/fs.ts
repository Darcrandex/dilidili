import { EChannel } from '@electron/enums'

export const fsService = {
  // 获取视频目录树
  getDirTree: async () => {
    const res: MainProcess.BVTreeWithInfo[] = await window.ipcRenderer.invoke(EChannel.GetBVInfo)
    return res
  },
}

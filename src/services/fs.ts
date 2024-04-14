import { EChannel } from '@electron/enums'
import { isNotNil } from 'ramda'

export const fsService = {
  // 获取视频目录树
  getDirTree: async () => {
    const res: MainProcess.BVTreeWithInfo[] = await window.ipcRenderer.invoke(EChannel.GetBVInfo)
    return res
  },

  getAllBVList: async () => {
    const res: MainProcess.BVTreeWithInfo[] = await window.ipcRenderer.invoke(EChannel.GetBVInfo)

    const bvs = res
      .reduce<MainProcess.BVTreeWithInfo['bvs']>((acc, m) => {
        return acc.concat(m.bvs)
      }, [])
      ?.filter((b) => isNotNil(b.info))

    return bvs
  },
}

import { EChannel } from '@electron/enums'
import { isNotNil, omit } from 'ramda'

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

  // 获取本地 up 主列表
  getUps: async () => {
    const dirTree: MainProcess.BVTreeWithInfo[] = await window.ipcRenderer.invoke(EChannel.GetBVInfo)
    return dirTree.map((v) => omit(['bvs'], v))
  },

  // 根据 mid 获取 bv 列表
  getBVListByMid: async (params: { mid?: string; page?: number; pageSize?: number; keyword?: string }) => {
    const dirTree: MainProcess.BVTreeWithInfo[] = await window.ipcRenderer.invoke(EChannel.GetBVInfo)
    let bvs: MainProcess.BVTreeWithInfo['bvs'] = []

    const hasLocalVideos = (b: MainProcess.BVTreeWithInfo['bvs'][number]) => b.localInfo?.videoPaths?.length > 0

    if (params.mid) {
      const matchedBVs = dirTree.find((d) => d.mid === params.mid)?.bvs?.filter(hasLocalVideos) || []
      bvs = matchedBVs
    } else {
      bvs = dirTree.flatMap((m) => m.bvs).filter(hasLocalVideos)
    }

    if (params.keyword?.trim()) {
      bvs = bvs.filter((b) => b.info?.title.includes(params.keyword!))
    }

    // sort by publish date
    bvs = bvs.sort((a, b) => (a.info?.pubdate && b.info?.pubdate ? b.info?.pubdate - a.info?.pubdate : 0))

    const total = bvs.length
    const limit = params.pageSize || 20
    const offset = (params.page || 1) * limit - limit

    return { list: bvs.slice(offset, offset + limit), total }
  },
}

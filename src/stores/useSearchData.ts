// 缓存搜索页面的数据

import { atom, useAtom } from 'jotai'

const stateAtom = atom({ bvid: '', searchUrl: '', quality: 0 })

export const useSearchData = () => useAtom(stateAtom)

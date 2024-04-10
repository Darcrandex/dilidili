import { atom, useAtom } from 'jotai'

const stateAtom = atom({ text: '' })

// 用来缓存视频搜索的关键字
export function useVideoSearch() {
  return useAtom(stateAtom)
}

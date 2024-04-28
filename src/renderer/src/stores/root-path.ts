import { EStorage } from '@main/enums'
import { atomWithElectronStore } from '@renderer/utils/atom-with-electron-store'
import { useAtom } from 'jotai'

const stateAtom = atomWithElectronStore(EStorage.RootDir, '')

// 管理本地数据文件的根目录
export function useRootPath() {
  return useAtom(stateAtom)
}

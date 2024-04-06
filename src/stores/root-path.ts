import { atomWithElectronStore } from '@/utils/atom-with-electron-store'
import { EStorage } from '@electron/enums'
import { useAtom } from 'jotai'

const stateAtom = atomWithElectronStore(EStorage.RootDir, '')

// 管理本地数据文件的根目录
export function useRootPath() {
  return useAtom(stateAtom)
}

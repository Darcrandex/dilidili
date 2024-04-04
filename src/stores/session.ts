import { atomWithElectronStore } from '@/utils/atom-with-electron-store'
import { EStorage } from '@electron/enums'
import { useAtom } from 'jotai'

const stateAtom = atomWithElectronStore(EStorage.Session, '')

// 管理 bilibili 的 SESSDATA
export function useSession() {
  return useAtom(stateAtom)
}

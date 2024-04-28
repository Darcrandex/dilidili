import { EStorage } from '@main/enums'
import { atomWithElectronStore } from '@renderer/utils/atom-with-electron-store'
import { useAtom } from 'jotai'

const stateAtom = atomWithElectronStore(EStorage.Session, '')

// 管理 bilibili 的 SESSDATA
export function useSession() {
  return useAtom(stateAtom)
}

// 管理 bilibili 的 SESSDATA

import { STORAGE_SESSION_KEY } from '@electron/const'
import { atomWithElectronStorage } from '@src/utils/atomWithElectronStorage'
import { useAtom } from 'jotai'

const stateAtom = atomWithElectronStorage<string | undefined>(STORAGE_SESSION_KEY, undefined)

export function useSessionData() {
  const [session, setSession] = useAtom(stateAtom)
  return { session, setSession }
}

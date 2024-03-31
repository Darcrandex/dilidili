// 管理文件数据存储的根目录

import { STORAGE_ROOT_PATH_KEY } from '@electron/const'
import { atomWithElectronStorage } from '@src/utils/atomWithElectronStorage'
import { useAtom } from 'jotai'

const stateAtom = atomWithElectronStorage<string>(STORAGE_ROOT_PATH_KEY, '')

export function useRootPath() {
  const [rootPath, setRootPath] = useAtom(stateAtom)
  return { rootPath, setRootPath }
}

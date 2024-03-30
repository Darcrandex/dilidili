// 管理 bilibili 的 SESSDATA

import { SESSION_KEY } from '@electron/const'
import { HandleChannel } from '@electron/enums'

export function useSession() {
  const setSession = (ss: string) => {
    console.log('setSession', ss)

    return window.ipcRenderer.invoke(HandleChannel.SetStore, { [SESSION_KEY]: ss })
  }

  const getSession = () => {
    return window.ipcRenderer.invoke(HandleChannel.GetStore, SESSION_KEY)
  }

  const clearSession = () => {
    return window.ipcRenderer.invoke(HandleChannel.RemoveStore, SESSION_KEY)
  }

  return { setSession, getSession, clearSession }
}

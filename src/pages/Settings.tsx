/**
 * @name Settings
 * @description
 * @author darcrand
 */

import { HandleChannel } from '@electron/enums'
import { useRootPath } from '@src/stores/useRootPath'

export default function Settings() {
  const { rootPath, setRootPath } = useRootPath()
  const onSelect = async () => {
    const res: string = await window.ipcRenderer.invoke(HandleChannel.SelectDir)
    if (res) setRootPath(res)
  }

  return (
    <>
      <h1>Settings</h1>

      <p>rootPath {rootPath}</p>

      <button onClick={onSelect}>select rootPath</button>

      <hr />
    </>
  )
}

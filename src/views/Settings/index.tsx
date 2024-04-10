/**
 * @name Settings
 * @description
 * @author darcrand
 */

import { useRootPath } from '@/stores/root-path'
import { EChannel } from '@electron/enums'
import { Button, Space } from 'antd'

export default function Settings() {
  const [rootPath, setRootPath] = useRootPath()
  const onSelectRootPath = async () => {
    const res = await window.ipcRenderer.invoke(EChannel.SelectDir)
    if (typeof res === 'string' && res.trim().length > 0) {
      setRootPath(res)
    }
  }

  return (
    <>
      <h1>Settings</h1>

      <p>rootPath: {rootPath}</p>

      <Space>
        <Button onClick={() => onSelectRootPath()}>选择文件夹目录</Button>
        <Button>清空缓存</Button>
      </Space>
    </>
  )
}

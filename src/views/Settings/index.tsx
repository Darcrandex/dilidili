/**
 * @name Settings
 * @description
 * @author darcrand
 */

import { useRootPath } from '@/stores/root-path'
import { EChannel } from '@electron/enums'
import { Button, Form, Input } from 'antd'

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
      <section className='m-10'>
        <Form layout='vertical'>
          <Form.Item label='视频根目录'>
            <div className='flex space-x-2'>
              <Input value={rootPath} readOnly />
              <Button onClick={() => onSelectRootPath()}>更改目录</Button>
            </div>
            <Button className='mt-2' type='link' onClick={() => window.ipcRenderer.invoke(EChannel.OpenDir, rootPath)}>
              查看当前目录
            </Button>
          </Form.Item>
        </Form>

        <Form layout='vertical'>
          <Form.Item label='缓存操作'>
            <Button>清空缓存</Button>
          </Form.Item>
        </Form>
      </section>
    </>
  )
}

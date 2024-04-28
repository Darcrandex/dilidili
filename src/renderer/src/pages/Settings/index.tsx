/**
 * @name Settings
 * @description
 * @author darcrand
 */

import { ipcActions } from '@renderer/actions'
import TopHeader from '@renderer/components/TopHeader'
import { useRootPath } from '@renderer/stores/root-path'
import { Button, Form, Input } from 'antd'

export default function Settings() {
  const [rootPath, setRootPath] = useRootPath()
  const onSelectRootPath = async () => {
    const res = await ipcActions.selectFolderDir()
    if (res) {
      setRootPath(res)
    }
  }

  return (
    <>
      <TopHeader showLogo={false} />

      <div className='max-w-xl mx-auto p-4'>
        <Form layout='vertical'>
          <Form.Item label='视频根目录'>
            <div className='flex space-x-2'>
              <Input value={rootPath} readOnly />
              <Button onClick={() => onSelectRootPath()}>更改目录</Button>
            </div>
            <Button className='mt-2' type='link' onClick={() => ipcActions.openFolder(rootPath)}>
              查看当前目录
            </Button>
          </Form.Item>
        </Form>

        <Form layout='vertical'>
          <Form.Item label='缓存操作'>
            <Button>清空缓存</Button>
          </Form.Item>
        </Form>
      </div>
    </>
  )
}

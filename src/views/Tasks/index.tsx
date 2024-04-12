/**
 * @name Tasks
 * @description
 * @author darcrand
 */

import { EChannel, EStorage } from '@electron/enums'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Button, Empty } from 'antd'
import Modal from 'antd/es/modal/Modal'
import { reverse } from 'ramda'
import { useState } from 'react'
import TaskItem from './TaskItem'

export default function Tasks() {
  const queryClient = useQueryClient()
  const { data: taskList } = useQuery({
    queryKey: ['tasks'],
    queryFn: async () => {
      const res: MainProcess.DownloadTask[] = await window.ipcRenderer.invoke(EChannel.GetStore, EStorage.DownloadTasks)
      return reverse(res)
    },
  })

  const [open, setOpen] = useState(false)
  const onRemoveAll = async () => {
    await window.ipcRenderer.invoke(EChannel.SetStore, { [EStorage.DownloadTasks]: [] })
    queryClient.invalidateQueries({ queryKey: ['tasks'] })
    queryClient.invalidateQueries({ queryKey: ['local-files', 'bv-tree'] })
    setOpen(false)
  }

  return (
    <>
      <div className='m-4 space-x-4'>
        <Button disabled={taskList?.length === 0} onClick={() => setOpen(true)}>
          清空下载任务
        </Button>
        <Button onClick={() => queryClient.invalidateQueries({ queryKey: ['tasks'] })}>刷新</Button>
      </div>

      <ul className='m-4 space-y-4'>
        {taskList?.map((v) => (
          <li key={v.id}>
            <TaskItem task={v} />
          </li>
        ))}
      </ul>

      {taskList?.length === 0 && <Empty description='暂无下载任务' />}

      <Modal title='提示' open={open} onOk={onRemoveAll} onCancel={() => setOpen(false)}>
        <p>确定要清空下载任务吗?</p>
        <p>此操作不会删除已下载的文件</p>
      </Modal>
    </>
  )
}

/**
 * @name Tasks
 * @description
 * @author darcrand
 */

import { taskService } from '@/services/tasks'
import UEmpty from '@/ui/UEmpty'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Button } from 'antd'
import Modal from 'antd/es/modal/Modal'
import { reverse } from 'ramda'
import { useState } from 'react'
import TaskItem from './TaskItem'

export default function Tasks() {
  const queryClient = useQueryClient()
  const { data: taskList } = useQuery({
    queryKey: ['tasks'],
    queryFn: async () => {
      const res = await taskService.getTasks()
      return reverse(res)
    },
  })

  const [open, setOpen] = useState(false)

  const onRemoveAll = async () => {
    await taskService.clearTasks()
    queryClient.invalidateQueries({ queryKey: ['tasks'] })
    queryClient.invalidateQueries({ queryKey: ['local-files'] })
    setOpen(false)
  }

  return (
    <>
      <div className='max-w-xl mx-auto p-4'>
        <section className='space-y-4'>
          <div className='space-x-4'>
            <Button disabled={taskList?.length === 0} onClick={() => setOpen(true)}>
              清空下载任务
            </Button>
            <Button onClick={() => queryClient.invalidateQueries({ queryKey: ['tasks'] })}>刷新</Button>
          </div>

          <ul className='space-y-8'>
            {taskList?.map((v) => (
              <li key={v.id}>
                <TaskItem task={v} />
              </li>
            ))}
          </ul>

          {taskList?.length === 0 && <UEmpty>没有任务</UEmpty>}
        </section>
      </div>

      <Modal title='提示' open={open} onOk={onRemoveAll} onCancel={() => setOpen(false)}>
        <p>确定要清空下载任务吗?</p>
        <p>此操作不会删除已下载的文件</p>
      </Modal>
    </>
  )
}

/**
 * @name Tasks
 * @description
 * @author darcrand
 */

import { EChannel, EStorage } from '@electron/enums'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Button } from 'antd'
import { useEffect } from 'react'

const taskStatusMap = new Map([
  [1, '下载中'],
  [2, '合并中'],
  [3, '完成'],
  [4, '下载失败'],
])

export default function Tasks() {
  const queryClient = useQueryClient()
  const { data: taskList } = useQuery({
    queryKey: ['tasks'],
    queryFn: async () => {
      const res: MainProcess.DownloadTask[] = await window.ipcRenderer.invoke(EChannel.GetStore, EStorage.DownloadTasks)
      return res
    },
  })

  useEffect(() => {
    const listener = (_event: any, key: string) => {
      if (key === EStorage.DownloadTasks) {
        queryClient.invalidateQueries({ queryKey: ['tasks'] })
      }
    }

    window.ipcRenderer.on(EChannel.StoreUpdated, listener)

    return () => {
      window.ipcRenderer.off(EChannel.StoreUpdated, listener)
    }
  }, [queryClient])

  const onRemoveAll = async () => {
    await window.ipcRenderer.invoke(EChannel.SetStore, { [EStorage.DownloadTasks]: [] })
    queryClient.invalidateQueries({ queryKey: ['tasks'] })
  }

  return (
    <>
      <h1>Tasks</h1>

      <Button onClick={onRemoveAll}>清空</Button>

      <ol className='list-decimal p-4'>
        {taskList?.map((v) => (
          <li key={v.id}>
            <p>{v.id}</p>
            <p>{taskStatusMap.get(v.status)}</p>
            <p>{v.params.videoInfo.title}</p>
          </li>
        ))}
      </ol>
    </>
  )
}

/**
 * @name TaskItem
 * @description
 * @author darcrand
 */

import { mediaService } from '@/services/media'
import { CheckCircleOutlined, CloseCircleOutlined, SyncOutlined } from '@ant-design/icons'
import { EChannel, EStorage } from '@electron/enums'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Popconfirm, Tag } from 'antd'
import { useMemo } from 'react'

const statusOptions = [
  { value: 1, label: '下载中', color: 'processing', icon: <SyncOutlined spin /> },
  { value: 2, label: '合并中', color: 'processing', icon: <SyncOutlined spin /> },
  { value: 3, label: '完成', color: 'success', icon: <CheckCircleOutlined /> },
  { value: 4, label: '下载失败', color: 'error', icon: <CloseCircleOutlined /> },
  { value: 0, label: '未知错误', color: 'error', icon: <CloseCircleOutlined /> },
]

export type TaskItemProps = {
  task: MainProcess.DownloadTask
}

export default function TaskItem(props: TaskItemProps) {
  const { bvid, cid } = props.task.params.videoInfo
  const { data: playurlData } = useQuery({
    queryKey: ['video', 'playurl', bvid, cid],
    enabled: !!bvid,
    queryFn: () => mediaService.playurl(bvid, cid),
  })

  const status = statusOptions.find((o) => o.value === props.task.status)

  const qualityLabel = useMemo(() => {
    if (!Array.isArray(playurlData?.support_formats) || !props.task.params.quality) return null
    return playurlData.support_formats.find((item) => item.quality === props.task.params.quality)?.new_description
  }, [playurlData, props.task.params.quality])

  const onOpenDir = async (folderDir: string) => {
    await window.ipcRenderer.invoke(EChannel.OpenDir, folderDir)
  }

  const queryClient = useQueryClient()

  const onRemove = async (id: string) => {
    const prevTasks: MainProcess.DownloadTask[] = await window.ipcRenderer.invoke(
      EChannel.GetStore,
      EStorage.DownloadTasks,
    )

    const updatedTasks = (prevTasks || []).filter((task) => task.id !== id)
    await window.ipcRenderer.invoke(EChannel.SetStore, { [EStorage.DownloadTasks]: updatedTasks })
    queryClient.invalidateQueries({ queryKey: ['tasks'] })
  }

  return (
    <>
      <div className='flex space-x-4 rounded-md transition-all hover:bg-gray-50'>
        <img
          src={props.task.params.videoInfo.pic}
          alt=''
          referrerPolicy='no-referrer'
          className='block w-32 h-24 rounded-md object-cover'
        />

        <article className='group flex-1 flex flex-col py-2'>
          <p className='flex-1 break-all'>{props.task.params.videoInfo.title}</p>

          <p className='flex flex-wrap text-sm'>
            <Tag>{props.task.params.videoInfo.owner.name}</Tag>

            <Tag color={status?.color} icon={status?.icon}>
              {status?.label}
            </Tag>

            <Tag>{qualityLabel}</Tag>

            <i className='flex-1'></i>

            <Tag
              className='!opacity-0 group-hover:!opacity-100 cursor-pointer'
              onClick={() => onOpenDir(props.task.folderDir)}
            >
              打开文件夹
            </Tag>

            <Popconfirm title='确定要删除此任务吗?' onConfirm={() => onRemove(props.task.id)}>
              <Tag className='!opacity-0 group-hover:!opacity-100 cursor-pointer' color='red'>
                删除任务
              </Tag>
            </Popconfirm>
          </p>
        </article>
      </div>
    </>
  )
}

/**
 * @name TaskItem
 * @description
 * @author darcrand
 */

import { mediaService } from '@/services/media'
import { CheckCircleOutlined, CloseCircleOutlined, SyncOutlined } from '@ant-design/icons'
import { EChannel, EStorage, ETaskStatus } from '@electron/enums'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Popconfirm, Tag } from 'antd'
import dayjs from 'dayjs'
import * as R from 'ramda'
import { useMemo } from 'react'

const statusOptions = [
  { value: ETaskStatus.Downloading, label: '下载中', color: 'processing', icon: <SyncOutlined spin /> },
  { value: ETaskStatus.Mixing, label: '合并中', color: 'processing', icon: <SyncOutlined spin /> },
  { value: ETaskStatus.Finished, label: '完成', color: 'success', icon: <CheckCircleOutlined /> },
  { value: ETaskStatus.Failed, label: '下载失败', color: 'error', icon: <CloseCircleOutlined /> },
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

  const onReDownload = async () => {
    // 下载地址可能会过期
    // 需要重新获取
    const matchedPageInfo = playurlData
    const videos = R.sort((a, b) => b.bandwidth - a.bandwidth, matchedPageInfo?.dash?.video || [])
    const videoDownloadUrl = videos.find((v) => v.id === props.task.params.quality)?.baseUrl || ''

    const audios = R.sort((a, b) => b.bandwidth - a.bandwidth, matchedPageInfo?.dash?.audio || [])
    const audioDownloadUrl = R.head(audios)?.baseUrl || ''

    const params: MainProcess.DownloadBVParams = {
      ...props.task.params,
      videoDownloadUrl,
      audioDownloadUrl,
    }
    window.ipcRenderer.invoke(EChannel.DownloadBV, params)
  }

  return (
    <>
      <div className='flex space-x-4 rounded-md transition-all hover:bg-gray-50'>
        <img
          src={props.task.params.videoInfo.pic}
          alt=''
          referrerPolicy='no-referrer'
          className='block w-36 h-24 rounded-md object-cover'
        />

        <article className='group flex-1 flex flex-col py-2'>
          <p className='flex-1 break-all'>{props.task.params.videoInfo.title}</p>

          <p className='flex flex-wrap text-sm'>
            <Tag>{props.task.params.videoInfo.owner.name}</Tag>

            <Tag color={status?.color} icon={status?.icon}>
              {status?.label}
              {`\t[${dayjs(props.task.createdAt).format('YYYY-MM-DD HH:mm:ss')}]`}
            </Tag>

            <Tag>{qualityLabel}</Tag>

            <i className='flex-1'></i>

            <Tag
              className='!opacity-0 group-hover:!opacity-100 cursor-pointer'
              onClick={() => onOpenDir(props.task.folderDir)}
            >
              打开文件夹
            </Tag>

            <Tag className='!opacity-0 group-hover:!opacity-100 cursor-pointer' onClick={onReDownload}>
              重新下载
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

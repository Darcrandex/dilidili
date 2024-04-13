/**
 * @name BVListItem
 * @description
 * @author darcrand
 */

import { FolderOpenOutlined } from '@ant-design/icons'
import { EChannel } from '@electron/enums'
import { Button, Space } from 'antd'
import dayjs from 'dayjs'
import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'

export type BVListItemProps = {
  localFolderDir: string
  videoInfo: MainProcess.VideoInfoSchema | null
  localInfo: MainProcess.BVTreeWithInfo['bvs'][number]['localInfo']
}

export default function BVListItem(props: BVListItemProps) {
  const navigate = useNavigate()

  const dateLabel = useMemo(() => {
    if (!props.videoInfo) return ''

    const d = dayjs(props.videoInfo.pubdate * 1000)
    const isSameDay = d.isSame(new Date(), 'day')
    const isSameYear = d.isSame(new Date(), 'year')
    if (isSameDay) return d.format('HH:mm')
    if (isSameYear) return d.format('MM-DD')
    return d.format('YYYY-MM-DD')
  }, [props])

  const onOpenDir = async () => {
    await window.ipcRenderer.invoke(EChannel.OpenDir, props.localFolderDir)
  }

  if (!props.videoInfo) return null

  return (
    <>
      <article className='space-y-2'>
        <img
          src={props.videoInfo.pic}
          alt=''
          referrerPolicy='no-referrer'
          className='block w-full h-40 rounded-md object-cover cursor-pointer hover:opacity-80 transition-all'
          onClick={() =>
            window.ipcRenderer.invoke(EChannel.OpenInBrowser, `https://www.bilibili.com/video/${props.videoInfo?.bvid}`)
          }
        />
        <div className='h-12 leading-6 overflow-clip'>{props.videoInfo.title}</div>

        <div className='flex items-center justify-between'>
          <label
            className='text-sm text-gray-400 hover:text-primary transition-colors cursor-pointer'
            onClick={() =>
              window.ipcRenderer.invoke(
                EChannel.OpenInBrowser,
                `https://space.bilibili.com/${props.videoInfo?.owner.mid}`,
              )
            }
          >
            <span>{props.videoInfo.owner.name}</span>
            <b className='inline-block mx-2'>·</b>
            <span>{dateLabel}</span>
          </label>

          <Space>
            <Button type='link' title='打开文件夹' icon={<FolderOpenOutlined />} onClick={onOpenDir} />
          </Space>
        </div>
      </article>
    </>
  )
}

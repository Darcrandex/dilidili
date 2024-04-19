/**
 * @name BVListItem
 * @description
 * @author darcrand
 */

import { DeleteOutlined, FolderOpenOutlined, LinkOutlined } from '@ant-design/icons'
import { EChannel } from '@electron/enums'
import { useQueryClient } from '@tanstack/react-query'
import { Button, Popconfirm } from 'antd'
import dayjs from 'dayjs'
import { useMemo } from 'react'

export type BVListItemProps = {
  bv: MainProcess.BVTreeWithInfo['bvs'][number]
  showUpName?: boolean
}

export default function BVListItem(props: BVListItemProps) {
  const queryClient = useQueryClient()
  const { info, localInfo } = props.bv

  const dateLabel = useMemo(() => {
    if (!info) return ''

    const d = dayjs(info.pubdate * 1000)
    const isSameDay = d.isSame(new Date(), 'day')
    const isSameYear = d.isSame(new Date(), 'year')
    if (isSameDay) return d.format('HH:mm')
    if (isSameYear) return d.format('MM-DD')
    return d.format('YYYY-MM-DD')
  }, [info])

  const onOpenDir = async () => {
    await window.ipcRenderer.invoke(EChannel.OpenDir, props.bv.dir)
  }

  const onRemoveDir = async () => {
    await window.ipcRenderer.invoke(EChannel.RemoveDir, props.bv.dir)
    queryClient.invalidateQueries({ queryKey: ['local-files'] })
  }

  const openVideo = async () => {
    if (!Array.isArray(localInfo?.videoPaths) || localInfo.videoPaths.length === 0) return

    const filePath = `${props.bv.dir}/${localInfo?.videoPaths[0]}`
    await window.ipcRenderer.invoke(EChannel.OpenVideoInSystemPlayer, filePath)
  }

  if (!info) return null

  return (
    <>
      <article className='group relative space-y-2'>
        <img
          src={info.pic}
          alt=''
          referrerPolicy='no-referrer'
          className='block w-full h-36 rounded-md object-cover cursor-pointer hover:opacity-80 transition-all'
          onClick={openVideo}
        />

        {localInfo.videoPaths.length > 1 && (
          <b className='absolute top-1 right-1 text-xs text-white'>{localInfo.videoPaths.length}P</b>
        )}

        <div className='h-12 leading-6 text-sm overflow-clip'>{info.title}</div>

        <div className='flex items-center justify-between'>
          <label
            className='text-xs text-gray-400 hover:text-primary transition-colors cursor-pointer'
            onClick={() =>
              window.ipcRenderer.invoke(EChannel.OpenInBrowser, `https://space.bilibili.com/${info?.owner.mid}`)
            }
          >
            {props.showUpName !== false && (
              <>
                <span>{info.owner.name}</span>
                <b className='inline-block mx-2'>·</b>
              </>
            )}
            <span>{dateLabel}</span>
          </label>

          <div className='space-x-2 transition-all opacity-0 group-hover:opacity-100'>
            <Button type='link' title='打开文件夹' icon={<FolderOpenOutlined />} onClick={onOpenDir} />

            <Button
              type='link'
              title='从B站打开'
              icon={<LinkOutlined />}
              onClick={() =>
                window.ipcRenderer.invoke(EChannel.OpenInBrowser, `https://www.bilibili.com/video/${info.bvid}`)
              }
            />

            <Popconfirm title='确定要删除此文件夹以及其中的视频吗?' onConfirm={onRemoveDir}>
              <Button type='link' title='删除文件夹' icon={<DeleteOutlined />} />
            </Popconfirm>
          </div>
        </div>
      </article>
    </>
  )
}

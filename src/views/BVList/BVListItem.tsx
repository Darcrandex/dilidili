/**
 * @name BVListItem
 * @description
 * @author darcrand
 */

import { DeleteOutlined, FolderOpenOutlined } from '@ant-design/icons'
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
  const { info } = props.bv

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

  if (!info) return null

  return (
    <>
      <article className='group space-y-2'>
        <img
          src={info.pic}
          alt=''
          referrerPolicy='no-referrer'
          className='block w-full h-40 rounded-md object-cover cursor-pointer hover:opacity-80 transition-all'
          onClick={() =>
            window.ipcRenderer.invoke(EChannel.OpenInBrowser, `https://www.bilibili.com/video/${info.bvid}`)
          }
        />
        <div className='h-12 leading-6 overflow-clip'>{info.title}</div>

        <div className='flex items-center justify-between'>
          <label
            className='text-sm text-gray-400 hover:text-primary transition-colors cursor-pointer'
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

            <Popconfirm title='确定要删除此文件夹以及其中的视频吗?' onConfirm={onRemoveDir}>
              <Button type='link' title='删除文件夹' icon={<DeleteOutlined />} />
            </Popconfirm>
          </div>
        </div>
      </article>
    </>
  )
}

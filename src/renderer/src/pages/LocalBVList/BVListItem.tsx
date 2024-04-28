/**
 * @name BVListItem
 * @description
 * @author darcrand
 */

import { DeleteOutlined, FolderOpenOutlined, LinkOutlined, MoreOutlined } from '@ant-design/icons'
import { ipcActions } from '@renderer/actions'
import UImage from '@renderer/ui/UImage'
import { cls } from '@renderer/utils/cls'
import { useQueryClient } from '@tanstack/react-query'
import { Button, Dropdown } from 'antd'
import dayjs from 'dayjs'
import { useMemo } from 'react'

export type BVListItemProps = {
  bv: MainProcess.BVTreeWithInfo['bvs'][number]
  showUpName?: boolean
  className?: string
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

  const onOpenDir = () => ipcActions.openFolder(props.bv.dir)

  const onRemoveDir = async () => {
    await ipcActions.deleteFolder(props.bv.dir)
    queryClient.invalidateQueries({ queryKey: ['bv-list'] })
  }

  const openVideo = async () => {
    if (!Array.isArray(localInfo?.videoPaths) || localInfo.videoPaths.length === 0) return

    const filePath = `${props.bv.dir}/${localInfo?.videoPaths[0]}`
    await ipcActions.openVideo(filePath)
  }

  if (!info) return null

  return (
    <>
      <article className={cls('group relative space-y-2', props.className)}>
        <UImage
          className='h-36 rounded-md cursor-pointer hover:opacity-80 hover:shadow-xl transition-all'
          src={info.pic}
          onClick={openVideo}
        />

        {localInfo.videoPaths.length > 1 && (
          <b className='absolute top-1 right-1 !m-0 text-xs text-white'>{localInfo.videoPaths.length}P</b>
        )}

        <div className='h-12 leading-6 text-sm overflow-clip'>{info.title}</div>

        <div className='flex items-center justify-between'>
          <label
            className='text-xs text-gray-400 hover:text-primary transition-colors cursor-pointer'
            onClick={() => ipcActions.openInBrowser(`https://space.bilibili.com/${info?.owner.mid}`)}
          >
            {props.showUpName !== false && (
              <>
                <span>{info.owner.name}</span>
                <b className='inline-block mx-2'>·</b>
              </>
            )}
            <span>{dateLabel}</span>
          </label>

          <Dropdown
            trigger={['click']}
            menu={{
              items: [
                { key: 'open', icon: <FolderOpenOutlined />, label: '打开文件夹', onClick: onOpenDir },
                {
                  key: 'link',
                  icon: <LinkOutlined />,
                  label: '从B站打开',
                  onClick: () => ipcActions.openInBrowser(`https://www.bilibili.com/video/${info.bvid}`)
                },
                { key: 'remove', icon: <DeleteOutlined />, label: '删除文件夹', onClick: onRemoveDir }
              ]
            }}
          >
            <Button shape='circle' type='text' icon={<MoreOutlined />} />
          </Dropdown>
        </div>
      </article>
    </>
  )
}

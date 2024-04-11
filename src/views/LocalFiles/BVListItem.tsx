/**
 * @name BVListItem
 * @description
 * @author darcrand
 */

import { EChannel } from '@electron/enums'
import { Button } from 'antd'
import dayjs from 'dayjs'

export type BVListItemProps = {
  localFolderDir: string
  videoInfo: MainProcess.VideoInfoSchema | null
  localInfo: MainProcess.BVTreeWithInfo['bvs'][number]['localInfo']
}

export default function BVListItem(props: BVListItemProps) {
  if (!props.videoInfo) return null

  const onOpenDir = async () => {
    await window.ipcRenderer.invoke(EChannel.OpenDir, props.localFolderDir)
  }

  return (
    <>
      <article className='p-4'>
        <img
          src={props.videoInfo.pic}
          alt=''
          referrerPolicy='no-referrer'
          className='block w-full h-36 rounded-md object-cover'
        />
        <p className='truncate'>{props.videoInfo.title}</p>

        <p className='flex items-center justify-between'>
          <span>up: {props.videoInfo.owner.name}</span>
          <span>{dayjs(props.videoInfo.pubdate * 1000).format('YYYY-MM-DD HH:mm:ss')}</span>
        </p>

        <Button onClick={onOpenDir}>打开本地文件夹</Button>
      </article>
    </>
  )
}

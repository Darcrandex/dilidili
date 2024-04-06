/**
 * @name BVListItem
 * @description
 * @author darcrand
 */

import { EChannel } from '@electron/enums'
import { Button } from 'antd'

export type BVListItemProps = {
  localFolderDir: string
  videoInfo: MainProcess.VideoInfoSchema
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
        <p>up: {props.videoInfo.owner.name}</p>

        <Button onClick={onOpenDir}>打开本地文件夹</Button>
      </article>
    </>
  )
}

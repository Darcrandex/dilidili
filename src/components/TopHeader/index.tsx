/**
 * @name TopHeader
 * @description
 * @author darcrand
 */

import logoImage from '@/assets/logos/dilidili-logo1@0.25x.png'
import { cls } from '@/utils/cls'
import { BlockOutlined, CloseOutlined, ExpandOutlined, LineOutlined } from '@ant-design/icons'
import { WindowControl } from '@electron/enums'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Button } from 'antd'
import { PropsWithChildren } from 'react'
import './styles.css'

export type TopHeaderProps = PropsWithChildren<{
  className?: string
  showLogo?: boolean
}>

export default function TopHeader(props: TopHeaderProps) {
  const queryClient = useQueryClient()
  const { data: isMaximized } = useQuery({
    queryKey: ['window-control', 'is-maximized'],
    queryFn: async () => {
      return (await window.ipcRenderer.invoke(WindowControl.GetIsMaximized)) as boolean
    },
  })

  const onToggleMaximize = async () => {
    await window.ipcRenderer.invoke(WindowControl.ToggleMaximize)
    queryClient.invalidateQueries({ queryKey: ['window-control', 'is-maximized'] })
  }

  return (
    <>
      <header className={cls('top-header--draggable relative flex items-center border-b', props.className)}>
        {props.showLogo !== false && <img src={logoImage} alt='dilidili' className='w-auto h-6 mx-4' />}

        <div className='top-header--undraggable'>{props.children}</div>

        <div className='top-header--undraggable self-start ml-auto p-2'>
          <Button
            type='link'
            icon={<LineOutlined />}
            onClick={() => window.ipcRenderer.invoke(WindowControl.Minimize)}
          />

          <Button type='link' icon={isMaximized ? <BlockOutlined /> : <ExpandOutlined />} onClick={onToggleMaximize} />

          <Button type='link' icon={<CloseOutlined />} onClick={() => window.ipcRenderer.invoke(WindowControl.Close)} />
        </div>
      </header>
    </>
  )
}

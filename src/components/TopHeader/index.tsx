/**
 * @name TopHeader
 * @description
 * @author darcrand
 */

import { cls } from '@/utils/cls'
import { PropsWithChildren } from 'react'

export type TopHeaderProps = PropsWithChildren<{
  className?: string
}>

export default function TopHeader(props: TopHeaderProps) {
  return (
    <>
      <header className={cls('flex items-center p-4 border-b', props.className)}>
        <h1>dilidili</h1>

        {props.children}
      </header>
    </>
  )
}

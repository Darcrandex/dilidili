/**
 * @name UEmpty
 * @description
 * @author darcrand
 */

import { cls } from '@/utils/cls'
import { PropsWithChildren } from 'react'

export type UEmptyProps = PropsWithChildren<{ className?: string }>

export default function UEmpty(props: UEmptyProps) {
  return (
    <>
      <div className={cls('text-center my-10 space-y-2 text-gray-400', props.className)}>
        <p>╮（﹀＿﹀）╭</p>
        <p>{props.children}</p>
      </div>
    </>
  )
}

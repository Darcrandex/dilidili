/**
 * @name UScrollView
 * @description
 * @author darcrand
 */

import { cls } from '@renderer/utils/cls'
import { PropsWithChildren, forwardRef, useEffect, useImperativeHandle, useRef } from 'react'
import Scrollbar from 'smooth-scrollbar'
import { ScrollbarOptions } from 'smooth-scrollbar/interfaces'

export type UScrollViewProps = PropsWithChildren<{
  className?: string
  style?: React.CSSProperties
  options?: ScrollbarOptions
}>

export default forwardRef<Scrollbar, UScrollViewProps>(function UScrollView(props, ref) {
  const elRef = useRef<HTMLElement>(null)
  const scrollRef = useRef<Scrollbar>()

  useEffect(() => {
    if (elRef.current) {
      scrollRef.current = Scrollbar.init(elRef.current, props.options)
    }

    return () => scrollRef.current?.destroy()
  }, [props.options])

  useImperativeHandle(ref, () => scrollRef.current!, [])

  return (
    <>
      <section ref={elRef} className={cls(props.className)} style={props.style}>
        <div>{props.children}</div>
      </section>
    </>
  )
})

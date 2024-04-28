/**
 * @name UImage
 * @description
 * @author darcrand
 */

import { cls } from '@renderer/utils/cls'

export type UImageProps = {
  src?: string
  fit?: 'cover' | 'contain'
  className?: string
  onClick?: (e: React.MouseEvent) => void
}

export default function UImage(props: UImageProps) {
  return (
    <>
      <div
        className={cls('min-h-8 bg-slate-200 transition-all bg-no-repeat bg-center', props.className)}
        style={{ backgroundImage: `url(${props.src})`, backgroundSize: props.fit || 'cover' }}
        onClick={props.onClick}
      >
        {!!props.src && <img src={props.src} alt='' referrerPolicy='no-referrer' style={{ display: 'none' }} />}
      </div>
    </>
  )
}

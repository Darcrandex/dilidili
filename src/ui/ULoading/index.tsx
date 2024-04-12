/**
 * @name ULoading
 * @description
 * @author darcrand
 */

import { cls } from '@/utils/cls'
import { LoadingOutlined } from '@ant-design/icons'

export type ULoadingProps = { className?: string }

export default function ULoading(props: ULoadingProps) {
  return (
    <>
      <div className={cls('relative', props.className)}>
        <p className='absolute inset-0 flex items-center justify-center space-x-4 py-10 text-primary'>
          <LoadingOutlined />
          <span>loading...</span>
        </p>
      </div>
    </>
  )
}

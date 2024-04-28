/**
 * @name UpItem
 * @description
 * @author darcrand
 */

import { userService } from '@renderer/services/user'
import UImage from '@renderer/ui/UImage'
import { cls } from '@renderer/utils/cls'
import { useQuery } from '@tanstack/react-query'
import { NavLink } from 'react-router-dom'

export default function UpItem(props: { mid: string }) {
  const { data } = useQuery({
    queryKey: ['up', 'info', props.mid],
    queryFn: () => userService.getUserByMid(Number.parseInt(props.mid))
  })

  return (
    <>
      <NavLink
        className={({ isActive }) =>
          cls(
            'flex items-center space-x-2 m-2 p-2 rounded-md transition-all',
            isActive ? 'bg-slate-100' : 'hover:bg-slate-50'
          )
        }
        to={props.mid}
      >
        <UImage src={data?.card?.face} className='w-8 h-8 rounded-full' />
        <span className='truncate text-sm'>{data?.card?.name}</span>
      </NavLink>
    </>
  )
}

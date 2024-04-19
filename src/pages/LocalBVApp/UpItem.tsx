/**
 * @name UpItem
 * @description
 * @author darcrand
 */

import { userService } from '@/services/user'
import { cls } from '@/utils/cls'
import { useQuery } from '@tanstack/react-query'
import Avatar from 'antd/es/avatar/avatar'
import { NavLink } from 'react-router-dom'

export default function UpItem(props: { mid: string }) {
  const { data } = useQuery({
    queryKey: ['up', 'info', props.mid],
    queryFn: () => userService.getUserByMid(Number.parseInt(props.mid)),
  })

  return (
    <>
      <NavLink
        className={({ isActive }) =>
          cls(
            'flex items-center space-x-2 m-2 p-2 rounded-md transition-all',
            isActive ? 'bg-slate-100' : 'hover:bg-slate-50',
          )
        }
        to={props.mid}
      >
        <Avatar src={data?.card?.face} alt='' size={32} />
        <span className='truncate text-sm'>{data?.card?.name}</span>
      </NavLink>
    </>
  )
}

/**
 * @name UpItem
 * @description
 * @author darcrand
 */

import { userService } from '@/services/user'
import { cls } from '@/utils/cls'
import { useQuery } from '@tanstack/react-query'
import { NavLink } from 'react-router-dom'

export default function UpItem(props: { mid: string }) {
  const { data } = useQuery({
    queryKey: ['up', 'info', props.mid],
    queryFn: () => userService.getUserByMid(Number.parseInt(props.mid)),
  })

  return (
    <>
      <NavLink className={cls('flex items-center')} to={props.mid}>
        <img src={data?.card?.face} className='w-8 h-8 bg-slate-200 rounded-full' alt='' referrerPolicy='no-referrer' />
        <span>{data?.card?.name}</span>
      </NavLink>
    </>
  )
}

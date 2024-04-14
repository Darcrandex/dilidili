/**
 * @name UPListItem
 * @description
 * @author darcrand
 */

import { userService } from '@/services/user'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'

export type UPListItemProps = { mid: string }

export default function UPListItem(props: UPListItemProps) {
  const navigate = useNavigate()

  const { data } = useQuery({
    queryKey: ['user', 'card', props.mid],
    queryFn: () => userService.getUserByMid(Number.parseInt(props.mid)),
    enabled: !!props.mid,
    // up信息一般不会频繁更新，缓存久一点
    gcTime: 24 * 60 * 60 * 1000,
    staleTime: 24 * 60 * 60 * 1000,
  })

  return (
    <>
      <article
        className='group flex items-center space-x-4 p-4 rounded-lg cursor-pointer transition-all hover:bg-slate-50'
        onClick={() => navigate(`/up/${props.mid}`)}
      >
        <img
          src={data?.card?.face}
          alt=''
          className='w-16 h-16 rounded-full border-2 border-white bg-slate-200'
          referrerPolicy='no-referrer'
        />

        <div>
          <p className='leading-8 transition-all group-hover:text-primary'>{data?.card?.name}</p>
          <p className='text-sm text-gray-500'>{data?.card.Official.title || '这个 up 没有简介~~'}</p>
        </div>
      </article>
    </>
  )
}

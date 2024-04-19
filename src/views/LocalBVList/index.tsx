/**
 * @name LocalBVList
 * @description
 * @author darcrand
 */

import { fsService } from '@/services/fs'
import { userService } from '@/services/user'
import { useQuery } from '@tanstack/react-query'
import { Pagination } from 'antd'
import { isNil, isNotNil } from 'ramda'
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import BVListItem from './BVListItem'

export default function LocalBVList() {
  const mid = useParams().mid
  const [page, setPage] = useState(1)

  const { data: profile } = useQuery({
    enabled: !!mid,
    queryKey: ['up', 'info', mid],
    queryFn: () => userService.getUserByMid(Number.parseInt(mid || '')),
  })

  const { data: bvList } = useQuery({
    queryKey: ['local-files', 'bv-list', page, mid],
    queryFn: () => fsService.getBVListByMid({ mid, page, pageSize: 20 }),
  })

  return (
    <>
      {isNotNil(profile) && (
        <section className='flex items-center p-4 rounded-lg bg-slate-50'>
          <img src={profile?.card.face} alt='face' className='w-20 h-20 rounded-full border border-white' />
          <div className='ml-4'>
            <p className='space-x-2'>
              <span className='font-bold text-xl'>{profile?.card.name}</span>
              <sup className='inline-block px-1 text-xs bg-orange-500 text-white'>
                lv.{profile?.card?.level_info?.current_level}
              </sup>
              <sup className='rounded-full px-2 py-1 text-xs bg-primary text-white'>
                {profile?.card?.level_info?.current_min}
              </sup>
            </p>
            <p className='mt-2 text-gray-600'>mid:{mid}</p>
          </div>
        </section>
      )}

      <ul className='flex flex-wrap'>
        {bvList?.map((v) => (
          <li key={v.bvid} className='w-1/3 p-2'>
            <BVListItem bv={v} showUpName={isNil(mid)} />
          </li>
        ))}
      </ul>

      <Pagination current={page} total={bvList?.length} onChange={(page) => setPage(page)} />
    </>
  )
}

/**
 * @name LocalBVList
 * @description
 * @author darcrand
 */

import { fsService } from '@/services/fs'
import { userService } from '@/services/user'
import { useQuery } from '@tanstack/react-query'
import { useDebounce, useSize } from 'ahooks'
import { Input, Pagination } from 'antd'
import Avatar from 'antd/es/avatar/avatar'
import { isNil, isNotNil } from 'ramda'
import { CSSProperties, useMemo, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import BVListItem from './BVListItem'

export default function LocalBVList() {
  const mid = useParams().mid
  const [page, setPage] = useState(1)
  const [searchText, setSearchText] = useState('')
  const keyword = useDebounce(searchText, { wait: 1000 })

  const { data: profile } = useQuery({
    enabled: !!mid,
    refetchOnMount: 'always',
    queryKey: ['up', 'info', mid],
    queryFn: () => userService.getUserByMid(Number.parseInt(mid || '')),
  })

  const { data: bvList } = useQuery({
    refetchOnMount: 'always',
    queryKey: ['bv-list', page, mid, keyword],
    queryFn: () => fsService.getBVListByMid({ mid, page, pageSize: 20, keyword }),
  })

  // layout
  const elRef = useRef<HTMLUListElement>(null)
  const wrapperSize = useSize(elRef)
  const itemStyle: CSSProperties = useMemo(() => {
    const wrapperWidth = wrapperSize?.width || window.innerWidth
    const itemMinHeight = 150
    const itemMinWith = itemMinHeight * (16 / 9)
    const cols = Math.floor(wrapperWidth / itemMinWith) || 1
    return { width: `${Math.round(100 / cols)}%` }
  }, [wrapperSize])

  return (
    <>
      <div className='max-w-xl mx-auto p-4'>
        {isNotNil(profile) && (
          <section className='flex items-center p-4 rounded-lg bg-slate-50'>
            <Avatar src={profile?.card.face} alt='face' size={80}>
              {profile?.card.name}
            </Avatar>

            <div className='ml-4'>
              <p className='space-x-2'>
                <span className='font-bold text-xl'>{profile?.card.name}</span>
                <sup className='inline-block px-1 text-xs bg-orange-500 text-white'>
                  lv.{profile?.card?.level_info?.current_level}
                </sup>
              </p>
              <p className='mt-2 text-gray-500'>MID:{mid}</p>
              <p className='text-gray-500'>{profile.card.sign}</p>
            </div>
          </section>
        )}

        <div className='w-sm mx-auto my-10'>
          <Input.Search
            maxLength={30}
            placeholder='搜索视频'
            enterButton
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            allowClear
          />
        </div>

        <ul ref={elRef} className='flex flex-wrap -mx-4 my-2'>
          {bvList?.map((v) => (
            <li key={v.bvid} style={itemStyle}>
              <BVListItem bv={v} showUpName={isNil(mid)} className='m-4' />
            </li>
          ))}
        </ul>

        <footer className='my-4'>
          <Pagination
            className='text-center'
            hideOnSinglePage
            current={page}
            total={bvList?.length}
            onChange={(page) => setPage(page)}
          />
        </footer>
      </div>
    </>
  )
}

/**
 * @name LocalBVApp
 * @description
 * @author darcrand
 */

import { fsService } from '@renderer/services/fs'
import { cls } from '@renderer/utils/cls'
import { useQuery } from '@tanstack/react-query'
import { Avatar } from 'antd'
import { Suspense } from 'react'
import { NavLink, Outlet, useParams } from 'react-router-dom'
import UpItem from './UpItem'

export default function LocalBVApp() {
  const mid = useParams().mid
  const isAll = mid === undefined
  const { data: allUps } = useQuery({ queryKey: ['local-files', 'up-list'], queryFn: () => fsService.getUps() })

  return (
    <>
      <section className='flex-1 flex h-full'>
        <aside className='w-40 border-r overflow-auto'>
          <NavLink
            className={cls(
              'flex items-center space-x-2 m-2 p-2 rounded-md transition-all',
              isAll ? 'bg-slate-100' : 'hover:bg-slate-50'
            )}
            to=''
          >
            <Avatar className='w-8 h-8'>all</Avatar>
            <span className='truncate text-sm'>全部UP主</span>
          </NavLink>

          {allUps?.map((v) => <UpItem key={v.mid} mid={v.mid} />)}
        </aside>

        <main className='flex-1 overflow-auto'>
          <Suspense fallback={null}>
            <Outlet />
          </Suspense>
        </main>
      </section>
    </>
  )
}

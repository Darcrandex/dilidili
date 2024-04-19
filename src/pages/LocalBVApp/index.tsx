/**
 * @name LocalBVApp
 * @description
 * @author darcrand
 */

import { fsService } from '@/services/fs'
import { cls } from '@/utils/cls'
import { useQuery } from '@tanstack/react-query'
import { Avatar } from 'antd'
import { Suspense } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import UpItem from './UpItem'

export default function LocalBVApp() {
  const { data: allUps } = useQuery({ queryKey: ['local-files', 'up-list'], queryFn: () => fsService.getUps() })

  return (
    <>
      <section className='flex-1 flex h-full'>
        <aside className='w-40 border-r overflow-auto'>
          <NavLink
            className={({ isActive }) =>
              cls(
                'flex items-center space-x-2 m-2 p-2 rounded-md transition-all',
                isActive ? 'bg-slate-100' : 'hover:bg-slate-50',
              )
            }
            to=''
          >
            <Avatar className='w-8 h-8'>all</Avatar>
            <span className='truncate text-sm'>全部</span>
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

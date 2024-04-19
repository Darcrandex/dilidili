/**
 * @name LocalBVApp
 * @description
 * @author darcrand
 */

import { fsService } from '@/services/fs'
import { cls } from '@/utils/cls'
import { useQuery } from '@tanstack/react-query'
import { Suspense } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import UpItem from './UpItem'

export default function LocalBVApp() {
  const { data: allUps } = useQuery({ queryKey: ['local-files', 'up-list'], queryFn: () => fsService.getUps() })

  return (
    <>
      <section className='flex-1 flex h-full'>
        <aside className='w-40 border-r'>
          <NavLink className={cls('block my-2')} to=''>
            all
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

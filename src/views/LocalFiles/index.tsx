/**
 * @name LocalFiles
 * @description
 * @author darcrand
 */

import { cls } from '@/utils/cls'
import { Suspense } from 'react'
import { NavLink, Outlet } from 'react-router-dom'

const navs = [
  { to: 'up-list', title: 'UP主列表' },
  { to: 'bv-list', title: '视频列表' },
]

export default function LocalFiles() {
  return (
    <>
      <nav className='flex items-center justify-center space-x-4 m-4'>
        {navs.map((v) => (
          <NavLink
            key={v.to}
            to={v.to}
            replace
            className={({ isActive }) =>
              cls('text-sm', isActive ? 'text-primary' : 'text-gray-500 hover:text-primary/50')
            }
          >
            {v.title}
          </NavLink>
        ))}
      </nav>

      <Suspense fallback={null}>
        <Outlet />
      </Suspense>
    </>
  )
}

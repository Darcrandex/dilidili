/**
 * @name Home
 * @description
 * @author darcrand
 */

import { Suspense } from 'react'
import { NavLink, Outlet } from 'react-router-dom'

const navs = [
  { to: 'search', title: '搜索视频' },
  { to: 'tasks', title: '下载任务' },
  { to: 'local-files', title: '本地文件' },
]

export default function Home() {
  return (
    <>
      <section className='flex flex-col h-screen'>
        <header className='flex items-center p-4 border-b'>
          <h1>dilidili</h1>

          <nav className='flex items-center ml-4 space-x-2'>
            {navs.map((v) => (
              <NavLink key={v.to} to={v.to} replace>
                {v.title}
              </NavLink>
            ))}
          </nav>
        </header>

        <main className='flex-1 overflow-auto'>
          <Suspense fallback='loading...'>
            <Outlet />
          </Suspense>
        </main>
      </section>
    </>
  )
}

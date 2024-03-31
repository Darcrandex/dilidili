/**
 * @name Home
 * @description
 * @author darcrand
 */

import { NavLink, Outlet } from 'react-router-dom'

export default function Home() {
  return (
    <>
      <section className='flex-1 flex flex-col h-screen'>
        <header>
          <nav className='space-x-4'>
            <NavLink to='search'>搜索</NavLink>
            <NavLink to='tasks'>任务</NavLink>
            <NavLink to='files'>文件</NavLink>
          </nav>
        </header>

        <main>
          <Outlet />
        </main>
      </section>
    </>
  )
}

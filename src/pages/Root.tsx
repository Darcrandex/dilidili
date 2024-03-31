/**
 * @name Root
 * @description
 * @author darcrand
 */

import { NavLink, Outlet } from 'react-router-dom'

export default function Root() {
  return (
    <>
      <section className='flex h-screen'>
        <aside className='shrink-0 min-w-8 border-r'>
          <nav className='flex flex-col space-y-4 p-4'>
            <NavLink replace to='home'>
              Home
            </NavLink>
            <NavLink replace to='mine'>
              Mine
            </NavLink>
            <NavLink replace to='settings'>
              Settings
            </NavLink>
          </nav>
        </aside>

        <main className='flex-1'>
          <Outlet />
        </main>
      </section>
    </>
  )
}

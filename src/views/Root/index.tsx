/**
 * @name Root
 * @description
 * @author darcrand
 */

import { Suspense } from 'react'
import { Outlet } from 'react-router-dom'
import AsideMenus from './AsideMenus'

export default function Root() {
  return (
    <>
      <section className='flex h-screen'>
        <AsideMenus />

        <main className='flex-1'>
          <Suspense fallback='loading...'>
            <Outlet />
          </Suspense>
        </main>
      </section>
    </>
  )
}

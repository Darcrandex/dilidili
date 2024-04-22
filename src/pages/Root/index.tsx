/**
 * @name Root
 * @description
 * @author darcrand
 */

import { Suspense, useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import AsideMenus from './AsideMenus'

export default function Root() {
  useEffect(() => {
    console.log('router', window.location)
  }, [])

  return (
    <>
      <section className='flex-1 flex h-screen'>
        <AsideMenus />

        <main className='flex-1'>
          <Suspense fallback={null}>
            <Outlet />
          </Suspense>
        </main>
      </section>
    </>
  )
}

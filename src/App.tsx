/**
 * @name App
 * @description
 * @author darcrand
 */

import { Suspense } from 'react'
import { createHashRouter, RouterProvider } from 'react-router-dom'
import { routes } from './routes'

const router = createHashRouter(routes)

export default function App() {
  return (
    <>
      <Suspense fallback='loading...'>
        <RouterProvider router={router} />
      </Suspense>
    </>
  )
}

// 通知 preload 进程移除 loading
postMessage({ payload: 'removeLoading' }, '*')

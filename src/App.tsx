/**
 * @name App
 * @description
 * @author darcrand
 */

import { Suspense } from 'react'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import { routes } from './routes'

const router = createBrowserRouter(routes)

export default function App() {
  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        <RouterProvider router={router} />
      </Suspense>
    </>
  )
}

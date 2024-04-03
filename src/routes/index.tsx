import { lazy } from 'react'
import { Navigate, RouteObject } from 'react-router-dom'

const Root = lazy(() => import('@/views/Root'))
const Home = lazy(() => import('@/views/Home'))
const Mine = lazy(() => import('@/views/Mine'))
const Settings = lazy(() => import('@/views/Settings'))
const Tasks = lazy(() => import('@/views/Tasks'))
const LocalFiles = lazy(() => import('@/views/LocalFiles'))
const Search = lazy(() => import('@/views/Search'))

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <Root />,

    children: [
      { index: true, element: <Navigate to='home' /> },
      {
        path: 'home',
        element: <Home />,

        children: [
          { index: true, element: <Navigate to='search' /> },
          { path: 'search', element: <Search /> },
          { path: 'tasks', element: <Tasks /> },
          { path: 'local-files', element: <LocalFiles /> },
        ],
      },

      { path: 'mine', element: <Mine /> },
      { path: 'settings', element: <Settings /> },
    ],
  },
]

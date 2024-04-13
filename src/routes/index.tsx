import { lazy } from 'react'
import { Navigate, RouteObject } from 'react-router-dom'

const Root = lazy(() => import('@/views/Root'))
const Home = lazy(() => import('@/views/Home'))
const Mine = lazy(() => import('@/views/Mine'))
const Settings = lazy(() => import('@/views/Settings'))
const Tasks = lazy(() => import('@/views/Tasks'))
const LocalFiles = lazy(() => import('@/views/LocalFiles'))
const UPList = lazy(() => import('@/views/UPList'))
const BVList = lazy(() => import('@/views/BVList'))
const Search = lazy(() => import('@/views/Search'))
const BVDetail = lazy(() => import('@/views/BVDetail'))
const UPDetail = lazy(() => import('@/views/UPDetail'))

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
          {
            path: 'local-files',
            element: <LocalFiles />,
            children: [
              { index: true, element: <Navigate to='up-list' /> },
              { path: 'up-list', element: <UPList /> },
              { path: 'bv-list', element: <BVList /> },
            ],
          },
        ],
      },

      { path: 'mine', element: <Mine /> },
      { path: 'settings', element: <Settings /> },
    ],
  },

  {
    path: '/bv/:id',
    element: <BVDetail />,
  },

  {
    path: '/up/:id',
    element: <UPDetail />,
  },
]

import { lazy } from 'react'
import { Navigate, RouteObject } from 'react-router-dom'

const Root = lazy(() => import('@/pages/Root'))
const Home = lazy(() => import('@/pages/Home'))
const Mine = lazy(() => import('@/pages/Mine'))
const Settings = lazy(() => import('@/pages/Settings'))

const SearchVideo = lazy(() => import('@/pages/SearchVideo'))
const Tasks = lazy(() => import('@/pages/Tasks'))
const LocalBVApp = lazy(() => import('@/pages/LocalBVApp'))
const LocalBVList = lazy(() => import('@/pages/LocalBVList'))

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
          { path: 'search', element: <SearchVideo /> },
          { path: 'tasks', element: <Tasks /> },
          {
            path: 'local-bv',
            element: <LocalBVApp />,
            children: [
              { index: true, element: <LocalBVList /> },
              { path: ':mid', element: <LocalBVList /> },
            ],
          },
        ],
      },

      { path: 'mine', element: <Mine /> },
      { path: 'settings', element: <Settings /> },
    ],
  },
]

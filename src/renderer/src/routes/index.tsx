import { lazy } from 'react'
import { Navigate, RouteObject } from 'react-router-dom'

const Root = lazy(() => import('@renderer/pages/Root'))
const Home = lazy(() => import('@renderer/pages/Home'))
const Mine = lazy(() => import('@renderer/pages/Mine'))
const Settings = lazy(() => import('@renderer/pages/Settings'))

const SearchVideo = lazy(() => import('@renderer/pages/SearchVideo'))
const Tasks = lazy(() => import('@renderer/pages/Tasks'))
const LocalBVApp = lazy(() => import('@renderer/pages/LocalBVApp'))
const LocalBVList = lazy(() => import('@renderer/pages/LocalBVList'))
const NotFound = lazy(() => import('@renderer/pages/404'))

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
              { path: ':mid', element: <LocalBVList /> }
            ]
          }
        ]
      },

      { path: 'mine', element: <Mine /> },
      { path: 'settings', element: <Settings /> }
    ]
  },

  { path: '*', element: <NotFound /> }
]

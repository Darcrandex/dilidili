import { Navigate, RouteObject } from 'react-router-dom'

import Files from '@src/pages/Files'
import Home from '@src/pages/Home'
import Mine from '@src/pages/Mine'
import Root from '@src/pages/Root'
import Search from '@src/pages/Search'
import Settings from '@src/pages/Settings'
import Tasks from '@src/pages/Tasks'

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
          { path: 'files', element: <Files /> },
        ],
      },

      { path: 'mine', element: <Mine /> },
      { path: 'settings', element: <Settings /> },
    ],
  },

  { path: '*', element: <div>404</div> },
]

/**
 * @name AsideMenus
 * @description
 * @author darcrand
 */

import { NavLink } from 'react-router-dom'

const menus = [
  { to: 'home', title: 'Home' },
  { to: 'mine', title: 'Mine' },
  { to: 'settings', title: 'Settings' },
]

export default function AsideMenus() {
  return (
    <>
      <aside className='w-20 border-r'>
        <nav className='space-y-4'>
          {menus.map((v) => (
            <NavLink key={v.to} to={v.to} replace className='block text-center'>
              {v.title}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  )
}

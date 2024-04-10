/**
 * @name AsideMenus
 * @description
 * @author darcrand
 */

import { cls } from '@/utils/cls'
import { HomeOutlined, SettingOutlined, SmileOutlined } from '@ant-design/icons'
import { NavLink } from 'react-router-dom'

const menus = [
  { to: 'home', title: 'Home', icon: <HomeOutlined /> },
  { to: 'mine', title: 'Mine', icon: <SmileOutlined /> },
  { to: 'settings', title: 'Settings', icon: <SettingOutlined /> },
]

export default function AsideMenus() {
  return (
    <>
      <aside className='border-r'>
        <nav>
          {menus.map((v) => (
            <NavLink
              key={v.to}
              to={v.to}
              replace
              className={({ isActive }) =>
                cls(
                  'block text-center transition-all text-xl px-4 py-2',
                  isActive ? 'text-primary' : 'hover:text-primary/50',
                )
              }
            >
              {v.icon}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  )
}

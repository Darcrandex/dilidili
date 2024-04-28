/**
 * @name Mine
 * @description
 * @author darcrand
 */

import { LogoutOutlined } from '@ant-design/icons'
import LoginModal from '@renderer/components/LoginModal'
import TopHeader from '@renderer/components/TopHeader'
import { userService } from '@renderer/services/user'
import { useSession } from '@renderer/stores/session'
import UImage from '@renderer/ui/UImage'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Button } from 'antd'
import { isNotNil } from 'ramda'

export default function Mine() {
  const [session, setSession] = useSession()
  const queryClient = useQueryClient()

  const { data: profile } = useQuery({
    queryKey: ['profile', session],
    enabled: !!session,
    queryFn: () => userService.profile()
  })

  const onLogout = () => {
    setSession('')
    queryClient.invalidateQueries()
  }

  const isLogin = isNotNil(profile)

  return (
    <>
      <TopHeader showLogo={false} />

      {isLogin ? (
        <>
          <div className='max-w-xl mx-auto p-4'>
            <section className='flex items-center p-4 rounded-lg bg-slate-50'>
              <UImage src={profile?.face} className='w-20 h-20 rounded-full' />

              <div className='ml-4'>
                <p className='space-x-2'>
                  <span className='font-bold text-xl'>{profile?.uname}</span>
                  <sup className='inline-block px-1 text-xs bg-orange-500 text-white'>
                    lv.{profile?.level_info.current_level}
                  </sup>
                  <sup className='rounded-full px-2 py-1 text-xs bg-primary text-white'>{profile.vip_label.text}</sup>
                </p>
                <p className='mt-2 text-gray-500 text-sm'>MID:{profile?.mid}</p>
              </div>

              <Button className='ml-auto' icon={<LogoutOutlined />} onClick={onLogout}>
                退出登录
              </Button>
            </section>
          </div>
        </>
      ) : null}

      <LoginModal
        renderTrigger={(onOpen) =>
          !isLogin && (
            <section className='m-10 text-center space-y-4'>
              <p>还没有登录</p>
              <p>
                <Button type='primary' onClick={onOpen}>
                  登录
                </Button>
              </p>
            </section>
          )
        }
      />
    </>
  )
}

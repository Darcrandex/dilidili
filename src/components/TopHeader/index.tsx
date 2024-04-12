/**
 * @name TopHeader
 * @description
 * @author darcrand
 */

import logoImage from '@/assets/logos/dilidili-logo1@0.25x.png'
import LoginModal from '@/components/LoginModal'
import { userService } from '@/services/user'
import { useSession } from '@/stores/session'
import { cls } from '@/utils/cls'
import { useQuery } from '@tanstack/react-query'
import { Button } from 'antd'
import { isNotNil } from 'ramda'
import { PropsWithChildren } from 'react'
import { useNavigate } from 'react-router-dom'

export type TopHeaderProps = PropsWithChildren<{
  className?: string
}>

export default function TopHeader(props: TopHeaderProps) {
  const [session] = useSession()
  const navigate = useNavigate()

  const { data: profile } = useQuery({
    queryKey: ['profile', session],
    enabled: !!session,
    queryFn: () => userService.profile(),
  })

  const isLogin = isNotNil(profile)

  return (
    <>
      <header className={cls('flex items-center p-4 border-b', props.className)}>
        <img src={logoImage} alt='dilidili' className='w-16' />

        {props.children}

        {isLogin ? (
          <img
            src={profile?.face}
            alt='face'
            referrerPolicy='no-referrer'
            className='w-10 h-10 rounded-full ml-auto cursor-pointer hover:shadow-md transition-all'
            onClick={() => navigate('/mine', { replace: true })}
          />
        ) : null}

        <LoginModal
          renderTrigger={(onOpen) =>
            !isLogin && (
              <Button className='ml-auto' type='primary' onClick={onOpen}>
                登录
              </Button>
            )
          }
        />
      </header>
    </>
  )
}

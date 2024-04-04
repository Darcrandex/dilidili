/**
 * @name Mine
 * @description
 * @author darcrand
 */

import LoginModal from '@/components/LoginModal'
import { userService } from '@/services/user'
import { useSession } from '@/stores/session'
import { useQuery } from '@tanstack/react-query'
import { Button } from 'antd'

export default function Mine() {
  const [session, setSession] = useSession()

  const { data: profile } = useQuery({
    queryKey: ['profile', session],
    enabled: !!session,
    queryFn: () => userService.profile(),
  })

  const isLogin = !!session

  return (
    <>
      <h1>Mine</h1>

      {isLogin ? (
        <>
          <h2>{profile?.uname}</h2>
          <Button onClick={() => setSession('')}>退出登录</Button>
        </>
      ) : null}

      <LoginModal renderTrigger={(onOpen) => !isLogin && <Button onClick={onOpen}>登录</Button>} />
    </>
  )
}

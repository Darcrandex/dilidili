/**
 * @name Mine
 * @description
 * @author darcrand
 */

import { userService } from '@src/services/user'
import { useSessionData } from '@src/stores/useSessionData'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'

export default function Mine() {
  const { data: userInfo, error } = useQuery({
    queryKey: ['profile'],
    queryFn: () => userService.profile(),
    select: (res) => res.data,
    retry: false,
  })

  const queryClient = useQueryClient()
  const { setSession } = useSessionData()
  const [value, setValue] = useState('')

  const onLogin = async () => {
    await setSession(value)
    queryClient.invalidateQueries()
    setValue('')
  }

  const onLogout = async () => {
    await setSession(undefined)
    queryClient.invalidateQueries()
  }

  return (
    <>
      <h1>Mine</h1>

      {error ? (
        <>
          <div>
            <p>手动添加 SESSDATA</p>
            <textarea
              className='block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900'
              rows={5}
              value={value}
              onChange={(e) => setValue(e.target.value)}
            ></textarea>
          </div>
          <button onClick={onLogin}>登录</button>
        </>
      ) : (
        <>
          <h2 className='text-3xl m-10 font-bold text-primary'>name {userInfo?.uname}</h2>
          <button onClick={onLogout}>退出登录</button>
        </>
      )}
    </>
  )
}

import { http } from '@src/utils/http'

export const userService = {
  profile: () => http<UserInfoSchema>({ url: 'https://api.bilibili.com/x/web-interface/nav' }),
}

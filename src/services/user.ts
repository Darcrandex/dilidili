import { http } from '@/utils/http'

export const userService = {
  profile: () => http({ url: 'https://api.bilibili.com/x/web-interface/nav' }),
}

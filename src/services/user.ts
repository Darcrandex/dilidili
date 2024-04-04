import { http } from '@/utils/http'

export const userService = {
  qrcode: () =>
    http<{ url: string; qrcode_key: string }>({
      url: 'https://passport.bilibili.com/x/passport-login/web/qrcode/generate',
    }),

  qrcodeCheck: (key: string) =>
    http<{ code: number; message: string; url: string }>({
      url: 'https://passport.bilibili.com/x/passport-login/web/qrcode/poll',
      params: { qrcode_key: key },
    }),

  profile: () => http<MainProcess.UserProfileShchema>({ url: 'https://api.bilibili.com/x/web-interface/nav' }),
}

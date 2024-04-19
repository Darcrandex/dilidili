import { http } from '@/utils/http'

export const userService = {
  // 获取二维码
  qrcode: () =>
    http<{ url: string; qrcode_key: string }>({
      url: 'https://passport.bilibili.com/x/passport-login/web/qrcode/generate',
    }),

  // 检查二维码状态
  qrcodeCheck: (key: string) =>
    http<{ code: number; message: string; url: string }>({
      url: 'https://passport.bilibili.com/x/passport-login/web/qrcode/poll',
      params: { qrcode_key: key },
    }),

  // 获取用户信息
  profile: () => http<MainProcess.UserProfileShchema>({ url: 'https://api.bilibili.com/x/web-interface/nav' }),

  // 获取 up 主信息
  getUserByMid: (mid: number) =>
    http<MainProcess.UPCardInfo>({
      url: 'https://api.bilibili.com/x/web-interface/card',
      params: { mid, photo: 'true' },
    }),
}

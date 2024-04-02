import { http } from '@/utils/http'

export const mediaService = {
  // 获取视频信息
  info: (bvid: string) =>
    http<MainProcess.VideoInfoSchema>({
      url: 'https://api.bilibili.com/x/web-interface/view',
      params: { bvid },
    }),

  // 获取视频下载地址
  playurl: (bvid: string, cid: number) =>
    http<MainProcess.PageInfoSchema>({
      url: 'https://api.bilibili.com/x/player/playurl',
      params: { bvid, cid, fnver: '0', fnval: '16', fourk: '1' },
    }),
}

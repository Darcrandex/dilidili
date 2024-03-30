import { http } from '@src/utils/http'

export const mediaService = {
  // 获取视频信息
  info: (bvid: string) =>
    http<VideoInfoSchema>({
      url: 'https://api.bilibili.com/x/web-interface/view',
      params: { bvid },
    }),

  // 获取视频下载地址
  playurl: (bvid: string, cid: number) =>
    http<PageInfoSchema>({
      url: 'https://api.bilibili.com/x/player/playurl',

      // 视频的清晰度选最大的
      params: { bvid, cid, fnver: '0', fnval: '16', fourk: '1' },
    }),
}

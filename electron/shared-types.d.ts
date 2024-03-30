// 主进程和渲染进程共享的数据类型定义

// [schema]

// 视频基本信息接口返回内容
interface VideoInfoSchema {
  bvid: string
  cid: number
  title: string
  pic: string
  duration: number
  owner: { mid: number; name: string; face: string }
  pages: Array<{ cid: number; page: number; part: string; duration: number }>
}

// 视频分P基本信息
interface PageInfoSchema {
  dash: {
    duration: number // 视频时长（秒）

    video: Array<{
      id: number
      baseUrl: string
      bandwidth: number // 码率
    }>
    audio: Array<{
      id: number
      baseUrl: string
      bandwidth: number
    }>
  }
  support_formats: Array<{
    quality: number
    new_description: string
  }>
}

// [common]

// 视频下载任务参数
interface VideoDownloadParams {
  videoDownloadUrl: string // 视频下载地址
  audioDownloadUrl: string // 音频下载地址
  coverImageUrl: string // 封面图片地址

  ownerId: string // up id
  bvid: string // 视频id
  page: number // 分P序号
  quality: number // 质量编号
}

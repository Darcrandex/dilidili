declare namespace MainProcess {
  interface DownloadBVParams {
    videoDownloadUrl: string // 视频下载地址
    audioDownloadUrl: string // 音频下载地址
    coverImageUrl: string // 封面图片地址

    ownerId: string // up id
    bvid: string // 视频id
    page: number // 分P序号
    quality: number // 质量编号
  }

  // 视频基本信息

  interface VideoInfoSchema {
    bvid: string
    cid?: number
    title: string
    pic: string
    duration: number
    owner: Owner
    pages: Page[]
  }

  interface Owner {
    mid: number
    name: string
    face: string
  }

  interface Page {
    cid: number
    page: number
    part: string
    duration: number
  }

  // 视频分P信息
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
}

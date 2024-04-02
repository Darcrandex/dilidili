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
}

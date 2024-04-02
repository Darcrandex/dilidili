import ffmpegPath from 'ffmpeg-static'
import FfmpegCommand from 'fluent-ffmpeg'

export function handleMergeVideo() {
  if (!ffmpegPath) {
    return
  }

  const command = FfmpegCommand()
  command.setFfmpegPath(ffmpegPath)

  return ffmpegPath
}

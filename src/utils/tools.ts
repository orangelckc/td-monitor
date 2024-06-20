/**
 * 转换时间格式到 hh:mm:ss
 */
export function formatTime(time: number) {
  if (!time) {
    return {
      hours: '00',
      minutes: '00',
      seconds: '00',
    }
  }

  const hours = Math.floor(time / 3600)
  const minutes = Math.floor((time - hours * 3600) / 60)
  const seconds = time - hours * 3600 - minutes * 60
  return {
    hours: hours.toString().padStart(2, '0'),
    minutes: minutes.toString().padStart(2, '0'),
    seconds: seconds.toString().padStart(2, '0'),
  }
}

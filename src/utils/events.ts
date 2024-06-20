import { ask } from '@tauri-apps/api/dialog'
import { TauriEvent, type UnlistenFn, listen } from '@tauri-apps/api/event'
import { open } from '@tauri-apps/api/shell'
import { getCurrent } from '@tauri-apps/api/window'

import { useAppStore } from '@/stores'

const events = {
  About: 'trigger-about',
  Switch: 'trigger-switch',
} as const

const listeners = [] as UnlistenFn[]
const currentWindow = getCurrent()

function unlistenAll() {
  listeners.forEach(unlisten => unlisten())
}

export async function initEvents() {
  unlistenAll()

  const closeEvent = await currentWindow.listen(TauriEvent.WINDOW_CLOSE_REQUESTED, () => {
    currentWindow.hide()
  })
  const switchFn = await listen(events.Switch, async () => {
    const { handleSwitch, isOn } = useAppStore()
    handleSwitch(!isOn)
  })
  const aboutFn = await listen(events.About, async () => {
    const answer = await ask('反馈请联系 @半糖人类', {
      title: '感谢使用 ♥️',
      okLabel: '关闭',
      cancelLabel: '联系作者',
    })
    if (!answer) {
      open('https://space.bilibili.com/405579368')
    }
  })
  listeners.push(
    closeEvent,
    switchFn,
    aboutFn,
  )
}

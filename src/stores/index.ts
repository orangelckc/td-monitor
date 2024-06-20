import { ask, message } from '@tauri-apps/api/dialog'
import dayjs from 'dayjs'
import { ElMessage } from 'element-plus'

import type { ILoginParams, ILoginResponse } from '@/apis'

import { login, status, toggle, usage } from '@/apis'
import { formatTime } from '@/utils/tools'

export const useAppStore = defineStore('app', () => {
  const tokenInfo = reactive<ILoginResponse>({
    token: '',
    expires: '',
  })
  const loginForm = reactive<ILoginParams>({
    account: '',
    password: '',
  })
  const isOn = ref(false)
  const leftTime = ref(0)
  // 空闲检测间隔，单位分钟
  const freeInterval = ref(10)

  const isLoading = ref(false)

  const isLogin = computed(() => !!tokenInfo.token && dayjs().isBefore(dayjs(tokenInfo.expires)))

  let lastUsage = 0
  async function checkUsage() {
    try {
      const { data } = await usage()
      if (!data)
        return

      const session = data.list[0]
      if (!session || session.end_time) {
        return
      }
      // 未结束的当前的会话
      if (session.total_req === 0 || session.total_req === lastUsage) {
        // 这个周期没有使用，需要 1min 后结束
        const timer = setTimeout(() => {
          handleSwitch(false)
        }, 60 * 1000)
        const isContinue = await ask('检测到长时间未使用，将在1分钟后自动关闭，是否继续使用？', {
          title: '长时间未使用',
          okLabel: '继续使用',
          cancelLabel: '立即关闭',
        })
        // 已经超时关闭了
        if (!isOn.value) {
          return
        }

        if (isContinue) {
          clearTimeout(timer)
          return
        }

        clearTimeout(timer)
        handleSwitch(false)
        return
      }
      lastUsage = session.total_req
    }
    catch (error: any) {
      console.error(error?.message)
      ElMessage.error('获取使用情况失败')
    }
  }

  let counter: NodeJS.Timeout
  let checker: NodeJS.Timeout
  function startCountDown() {
    clearCountDown()

    counter = setInterval(() => {
      leftTime.value--
      if (leftTime.value <= 0) {
        clearCountDown()
        isOn.value = false
        ElMessage.warning('没有可用时长了')
      }
    }, 1000)

    checker = setInterval(() => {
      checkUsage()
    }, freeInterval.value * 60 * 1000)
  }

  function clearCountDown() {
    if (counter)
      clearInterval(counter)
    if (checker)
      clearInterval(checker)
    lastUsage = 0
  }

  async function handleLogin() {
    try {
      isLoading.value = true
      const { data } = await login(loginForm)
      if (!data)
        return

      Object.assign(tokenInfo, {
        token: data.token,
        expires: dayjs().add(9, 'hour').toISOString(),
      })
    }
    catch (error: any) {
      ElMessage.error(error?.message || '登录失败')
    }
    finally {
      isLoading.value = false
    }
  }

  async function handleSwitch(state: boolean) {
    if (!isLogin.value) {
      message('', {
        title: '请先登录',
        type: 'error',
        okLabel: '关闭',
      })
      return
    }

    try {
      isLoading.value = true
      const { data } = await toggle(state)

      if (!data)
        return

      isOn.value = data.is_paused === 0
      const time = formatTime(data.remaining_time)
      const title = state ? '开启成功' : '关闭成功'
      const text = `剩余时间: ${time.hours}h${time.minutes}m${time.seconds}s`

      if (data.is_paused === 1) {
        clearCountDown()
      }
      else {
        message(text, {
          title,
          type: 'info',
          okLabel: '关闭',
        })
        startCountDown()
      }
    }
    catch (error: any) {
      console.error(error)
      ElMessage.error('切换失败')
      message('', {
        title: '切换失败',
        type: 'error',
        okLabel: '关闭',
      })
    }
    finally {
      isLoading.value = false
    }
  }

  async function checkStatus() {
    try {
      isLoading.value = true
      const { data } = await status()
      if (!data)
        return

      leftTime.value = data.remaining_time
      isOn.value = data.is_paused === 0

      if (data.is_paused === 1) {
        clearCountDown()
        return
      }
      startCountDown()
    }
    catch (error: any) {
      console.error(error?.message)
    }
    finally {
      isLoading.value = false
    }
  }

  watch(isLogin, (val) => {
    if (!val && loginForm.account && loginForm.password) {
      handleLogin()
    }
  })

  return {
    tokenInfo,
    loginForm,
    isOn,
    isLogin,
    isLoading,
    leftTime,
    handleLogin,
    handleSwitch,
    checkStatus,
  }
}, {
  persist: {
    paths: ['tokenInfo', 'loginForm', 'isOn', 'leftTime'],
  },
})

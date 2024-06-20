import { message } from '@tauri-apps/api/dialog'
import dayjs from 'dayjs'
import { ElMessage } from 'element-plus'

import type { ILoginParams, ILoginResponse } from '@/apis'

import { login, status, toggle } from '@/apis'
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

  const isLoading = ref(false)

  const isLogin = computed(() => !!tokenInfo.token && dayjs().isBefore(dayjs(tokenInfo.expires)))

  const handleLogin = async () => {
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

  let counter: NodeJS.Timeout
  function startCountDown() {
    if (counter)
      clearInterval(counter)

    counter = setInterval(() => {
      leftTime.value--
      if (leftTime.value <= 0) {
        clearInterval(counter)
        isOn.value = false
        ElMessage.warning('没有可用时长了')
      }
    }, 1000)
  }

  const handleSwitch = async (state: boolean) => {
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
        counter && clearInterval(counter)
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

  const checkStatus = async () => {
    try {
      isLoading.value = true
      const { data } = await status()
      if (!data)
        return

      leftTime.value = data.remaining_time
      isOn.value = data.is_paused === 0

      if (data.is_paused === 1) {
        counter && clearInterval(counter)
      }
      else {
        startCountDown()
      }
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

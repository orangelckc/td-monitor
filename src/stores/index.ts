import dayjs from 'dayjs'
import { ElMessage } from 'element-plus'

import type { ILoginParams, ILoginResponse } from '@/apis'

import { login, status, toggle } from '@/apis'

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

      ElMessage.success('登陆成功')
    }
    catch (error: any) {
      ElMessage.error(error?.message)
    }
    finally {
      isLoading.value = false
    }
  }

  let counter: NodeJS.Timeout
  function startCountDown() {
    counter = setInterval(() => {
      leftTime.value--
      if (leftTime.value <= 0) {
        clearInterval(counter)
        isOn.value = false
        ElMessage.warning('没有可用时长了')
      }
    }, 1000)
  }

  const handleSwitch = async () => {
    try {
      isLoading.value = true
      const { data } = await toggle(isOn.value)

      if (!data)
        return

      isOn.value = data.is_paused === 0
      ElMessage.success(isOn.value ? '开启成功' : '关闭成功')

      if (data.is_paused === 1) {
        clearInterval(counter)
        return
      }

      startCountDown()
    }
    catch (error: any) {
      console.error(error)
      ElMessage.error('切换失败')
    }
    finally {
      isLoading.value = false
    }
  }

  const checkStatus = async () => {
    try {
      const { data } = await status()
      if (!data)
        return

      leftTime.value = data.remaining_time
      isOn.value = data.is_paused === 0

      if (isOn.value) {
        startCountDown()
      }
    }
    catch (error: any) {
      console.error(error?.message)
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

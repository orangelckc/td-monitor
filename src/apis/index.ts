import { useAppStore } from '@/stores'
import request from '@/utils/request'

const apis = {
  loginApi: '/login/account',
  statusApi: '/service/copilot',
  toggleApi: '/service/copilot/switch',
} as const

export interface ILoginParams {
  account: string
  password: string
}

export interface ILoginResponse {
  token: string
  expires?: string
}

export function login(data: ILoginParams) {
  return request<ILoginResponse>({
    method: 'POST',
    url: apis.loginApi,
    data,
  })
}

export interface IToggleResponse {
  is_paused: 0 | 1
  remaining_time: number
  update_time: string
}

export function status() {
  const { tokenInfo } = useAppStore()
  return request<IToggleResponse>({
    method: 'GET',
    url: apis.statusApi,
    headers: {
      Authorization: `Bearer ${tokenInfo.token}`,
    },
  })
}

export function toggle(isOn: boolean) {
  const { tokenInfo } = useAppStore()
  return request<IToggleResponse>({
    method: 'POST',
    url: apis.toggleApi,
    data: {
      is_paused: isOn ? 2 : 1,
    },
    headers: {
      Authorization: `Bearer ${tokenInfo.token}`,
    },
  })
}

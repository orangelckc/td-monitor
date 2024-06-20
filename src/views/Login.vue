<script lang="ts" setup>
import { ElForm } from 'element-plus'

import type { FormItemRule } from 'element-plus'

import { useAppStore } from '@/stores'

const { handleLogin } = useAppStore()
const { isLoading, loginForm } = storeToRefs(useAppStore())

const formRef = ref<InstanceType<typeof ElForm>>()

const rules = computed<Partial<Record<string, FormItemRule[]>>>(() => {
  return {
    account: [
      { required: true, message: '请填写用户名', trigger: 'blur' },
    ],
    password: [
      { required: true, message: '请填写密码', trigger: 'blur' },
    ],
  }
})

function resetForm() {
  formRef.value?.resetFields()
  formRef.value?.clearValidate()
}

async function handleSubmit() {
  const valid = await formRef.value?.validate().catch(() => false)

  if (!valid)
    return

  handleLogin()
}

onMounted(() => {
  resetForm()
})

onUnmounted(() => {
  resetForm()
})
</script>

<template>
  <el-card class="w-4/5 h-2/3 m-auto px-3">
    <ElForm
      ref="formRef"
      :model="loginForm"
      :rules="rules"
      status-icon
      :label-width="0"
    >
      <el-form-item>
        <img src="https://picsum.photos/id/237/600/400" alt="" class="rounded-lg w-full min-h-30 mx-auto">
      </el-form-item>
      <el-form-item prop="account" class="mt-6">
        <el-input v-model="loginForm.account" placeholder="请输入账号" />
      </el-form-item>
      <el-form-item prop="password">
        <el-input v-model="loginForm.password" placeholder="请输入密码" type="password" />
      </el-form-item>
      <el-form-item class="mt-6">
        <el-button type="primary" class="w-full" :loading="isLoading" @click="handleSubmit">
          登 录
        </el-button>
      </el-form-item>
    </ElForm>
  </el-card>
</template>

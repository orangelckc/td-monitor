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
      { required: true, message: '', trigger: 'blur' },
    ],
    password: [
      { required: true, message: '', trigger: 'blur' },
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
  <div class="m-auto bg-[#fafafa] w-full flex-1 center">
    <ElForm
      ref="formRef"
      :model="loginForm"
      :rules="rules"
      status-icon
      :label-width="0"
      class="w-full px-8 pt-8"
    >
      <el-form-item>
        <img src="/icon.png" alt="" class="h-30 w-30 mx-auto rounded-full">
      </el-form-item>
      <el-form-item prop="account" class="mt-6">
        <el-input v-model="loginForm.account" placeholder="账号" autofocus />
      </el-form-item>
      <el-form-item prop="password">
        <el-input v-model="loginForm.password" placeholder="密码" type="password" />
      </el-form-item>
      <el-form-item class="mt-6">
        <el-button type="primary" class="w-full" :loading="isLoading" @click="handleSubmit">
          登 录
        </el-button>
      </el-form-item>
      <el-form-item>
        <div class="flex justify-evenly text-[#999] text-xs w-full gap-2">
          <a href="https://tdcloud.cc" target="_blank">三狗论坛</a>
          <a href="https://shop.tdcloud.cc" target="_blank">三狗商城</a>
        </div>
      </el-form-item>
    </ElForm>
  </div>
</template>

<script lang="ts" setup>
import { LogicalSize, appWindow } from '@tauri-apps/api/window'

import { useAppStore } from '@/stores'
import { initEvents } from '@/utils/events'
import Home from '@/views/Home.vue'
import Login from '@/views/Login.vue'

const { isLogin } = storeToRefs(useAppStore())
const containerRef = ref()

function loadTree(parent: Element, callback: Function) {
  for (let i = 0; i < parent.children.length; i++) {
    const child = parent.children[i]
    loadTree(child, callback)
  }
  if (callback) {
    callback(parent)
  }
}

watch(isLogin, (value) => {
  appWindow.setSize(value ? new LogicalSize(320, 102) : new LogicalSize(280, 366))
  nextTick(() => {
    loadTree(containerRef.value, (el: HTMLElement) => {
      el.setAttribute('data-tauri-drag-region', '')
    })
  })
}, { immediate: true })

onMounted(() => {
  initEvents()
})
</script>

<template>
  <div ref="containerRef" class="h-100vh flex flex-col">
    <Login v-if="!isLogin" />
    <Home v-else />
  </div>
</template>

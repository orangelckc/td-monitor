<script lang="ts" setup>
import { useAppStore } from './stores'
import Home from './views/Home.vue'
import Login from './views/Login.vue'

const { isLogin } = storeToRefs(useAppStore())
</script>

<template>
  <div class="h-100vh flex flex-col">
    <Login v-if="!isLogin" />
    <Home v-else />
  </div>
</template>

<script lang="ts" setup>
import { useAppStore } from '@/stores'
import { formatTime } from '@/utils/tools'

const { isOn, isLoading, leftTime } = storeToRefs(useAppStore())
const { handleSwitch, checkStatus } = useAppStore()

const time = computed(() => formatTime(leftTime.value))

onMounted(() => {
  checkStatus()
})
</script>

<template>
  <div class="mx-auto mt-20">
    <div class="box">
      <div class="flex flex-col text-white gap-1 flex-1">
        <div class="text-3xl tracking-wider">
          <span>{{ time.hours }}</span>
          <span class="text-base">h</span>
          <span>{{ time.minutes }}</span>
          <span class="text-base">m</span>
          <span>{{ time.seconds }}</span>
          <span class="text-base">s</span>
        </div>
        <span class="text-xs text-[#ccc]">剩余时间</span>
      </div>
      <el-switch v-model="isOn" :loading="isLoading" size="large" @change="handleSwitch" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.box{
  @apply w-320px h-102px rounded-3xl flex items-center justify-between p-6;
  background: radial-gradient(circle,#44b5a1 5%,#4c67e800 60%) 201px -83px /200px 200px no-repeat,radial-gradient(circle,#2d1ef7,#7142e6 35%,#4c67e8) -170px -160px /600px 300px no-repeat;
}
</style>

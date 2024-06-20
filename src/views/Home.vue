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
  <div class="box">
    <div class="flex flex-col text-white gap-10px flex-1 mt-16px">
      <div class="flex justify-between">
        <div class="text-3xl tracking-wider flex items-end font-mono">
          <span>{{ time.hours }}</span>
          <span class="text-base">h</span>
          <span>{{ time.minutes }}</span>
          <span class="text-base">m</span>
          <span>{{ time.seconds }}</span>
          <span class="text-base">s</span>
          <el-button circle class="cursor-pointer ml-1 i-ic-outline-sync bg-transparent self-center" size="small" @click="checkStatus" />
        </div>
        <el-switch
          v-model="isOn"
          :loading="isLoading"
          style="--el-switch-on-color: #1cc09e;"
          @change="handleSwitch(isOn)"
        />
      </div>
      <div class="flex justify-between text-[#e3e3e3] text-xs">
        <span>剩余时间</span>
        <a href="https://tdcloud.cc" target="_blank">三狗论坛</a>
        <a href="https://shop.tdcloud.cc" target="_blank">三狗商城</a>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.box {
  @apply w-320px h-102px rounded-md flex items-center justify-between px-6;
  background: radial-gradient(circle, #44b5a1 5%, #4c67e800 60%) 201px -83px /200px 200px no-repeat, radial-gradient(circle, #2d1ef7, #7142e6 35%, #4c67e8) -170px -160px /600px 300px no-repeat;
}

.font-mono {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas,
    "Liberation Mono", "Courier New", monospace;
}
</style>

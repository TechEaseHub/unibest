<route lang="json5">
{
  layout: 'page',
  style: {
    navigationBarTitleText: '巡视列表 RouteInstanceList',
  },
}
</route>

<script setup lang="ts">
import Cell from '@/components/Cell/index.vue'
import { createOneRouteInstance } from '@/service/static/inspection'

import dayjs from 'dayjs'
import headerWrap from './components/headerWrap.vue'

const { HandleRouteDefine, routeInstanceList, handleRouteInstanceIdx, HeaderOptions, RouteInstanceParams } = storeToRefs(useInspection())
const { RunGetRouteInstanceList, UnLoadRouteInstance } = useInspection()

onLoad(() => {
  RouteInstanceParams.value = {
    routeDefineID: HandleRouteDefine.value.value,
  }
  RunGetRouteInstanceList()
})
onUnload(() => UnLoadRouteInstance())

async function createOneRoute() {
  const name = computed(() => {
    const res = HandleRouteDefine.value.label || '第一次巡视'
    return `${res}__${dayjs().format('MM-DD HH:MM:ss')}`
  })

  // 创建新的实例
  await createOneRouteInstance({
    routeDefineID: HandleRouteDefine.value.id,
    name: name.value,
  })
  RunGetRouteInstanceList()
}

function onClick(idx: number) {
  handleRouteInstanceIdx.value = idx
  uni.navigateTo({ url: '/pages/inspection/dotList' })
}
</script>

<template>
  <headerWrap :options="HeaderOptions" />

  <view class="flex-1 flex flex-col gap-4 h-full overflow-y-auto p-4">
    <template v-for="(item, idx) in routeInstanceList" :key="item.id">
      <Cell class="bg-white" :title="item.title" :label="item.label" :value="item.value" @click="onClick(idx)" />
    </template>
  </view>

  <wd-button custom-class="w-full mt-auto!" size="large" block @click="createOneRoute">
    创建新的巡视
  </wd-button>
</template>

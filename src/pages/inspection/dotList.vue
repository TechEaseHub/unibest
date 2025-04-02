<route lang="json5" type="page">
  {
    layout: 'page',
    style: {
      navigationBarTitleText: '巡视点位 RouteInstanceDotList',
    },
  }
</route>

<script setup lang="ts">
import Cell from '@/components/Cell/index.vue'
import { beginOneRouteInstance, endOneRouteInstance } from '@/service/static/inspection'
import headerWrap from './components/headerWrap.vue'

const {
  routeInstanceDotList,
  HandleRouteInstance,
  handleRouteInstanceDotIdx,
  HeaderOptions,

  HandleRouteDefine,
  RouteInstanceParams,
} = storeToRefs(useInspection())
const {
  RunGetRouteInstanceDotList,
  UnLoadDotList,
  RunGetRouteInstanceList,
} = useInspection()

const isRealBegin = computed(() => HandleRouteInstance.value?.realBeginTimeStr)
const isRealEnd = computed(() => HandleRouteInstance.value?.realEndTimeStr)

onLoad(() => RunGetRouteInstanceDotList())
onUnload(() => UnLoadDotList())

async function onReadBegin() {
  await beginOneRouteInstance({
    routeInstanceID: HandleRouteInstance.value.id,
  })

  RouteInstanceParams.value = {
    routeDefineID: HandleRouteDefine.value.value,
  }
  await RunGetRouteInstanceList()
}
async function onRealEnd() {
  await endOneRouteInstance({
    routeInstanceID: HandleRouteInstance.value.id,
  })
  RouteInstanceParams.value = {
    routeDefineID: HandleRouteDefine.value.value,
  }
  await RunGetRouteInstanceList()
}

function onclick(idx: number) {
  handleRouteInstanceDotIdx.value = idx
  uni.navigateTo({ url: '/pages/inspection/dot' })
}
</script>

<template>
  <headerWrap :options="HeaderOptions" />

  <view class="flex-1 overflow-y-auto flex flex-col gap-4 p-4">
    <template v-for="(item, idx) in routeInstanceDotList" :key="item.id">
      <Cell class="bg-white rounded-4" :title="item.title" :label="`到达时间: ${item.comeTimeStr}`" @click="onclick(idx)">
        <template #value>
          <view v-if="item.resultType === '1'" class="text-red text-8 i-ic:twotone-fact-check" />
          <view v-if="item.resultType === '2'" class="text-green i-ic:twotone-fact-check" />
        </template>
      </Cell>
    </template>
  </view>

  <view v-if="!isRealEnd">
    <wd-button v-if="!isRealBegin" custom-class="w-full mt-auto!" block @click="onReadBegin">
      开始巡视
    </wd-button>
    <wd-button v-else custom-class="w-full mt-auto!" block @click="onRealEnd">
      完成巡视
    </wd-button>
  </view>
</template>

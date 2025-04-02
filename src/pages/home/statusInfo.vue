<script lang="ts" setup>
import type * as Move from '@/service/static/move.type'

const { isChengguan } = storeToRefs(useUserStore())
const { getUserIllegalityPollUp } = useUserStore()

const { ParkAreaList, VehicleProcessList } = storeToRefs(useMoveStore())
const { RunGetParkAreaList, RunGetVehicleProcessList } = useMoveStore()

const { ViolationNum } = storeToRefs(useMoveTaskStore())

const { RouteInstanceList, instanceExectionNum } = storeToRefs(useInspection())
// const { toDayUserInstanceAndMoveList } = useInspection()

const { LocationInfo } = storeToRefs(useOtherStore())
const { GetLocation } = useOtherStore()

// 巡视次数
const instanceNum = computed(() => {
  return RouteInstanceList.value?.rows?.length || 0
})

// 挪车次数
const VehicleProcessNum = computed(() => {
  return VehicleProcessList.value?.rows?.length || 0
})

// 获取违章车辆个数
// const ViolationNum = ref(0)

const parkAreaList = computed(() => {
  return ParkAreaList.value?.rows || []
})

// 切换挪车或巡视按钮
const checkButton = computed(() => {
  return instanceNum.value === 0 || VehicleProcessList.value?.rows?.length === 0
})

// 距离计算
const { closestLocation, calculateDistances } = useDistanceCalculator()

function handleParkAreaList(ParkAreaList: Move.ParkAreaType[]) {
  return ParkAreaList.map((i: Move.ParkAreaType) => {
    return {
      lon: i.mapX && !Number.isNaN(Number.parseFloat(i.mapX)) ? Number.parseFloat(i.mapX) : Number.NaN,
      lat: i.mapY && !Number.isNaN(Number.parseFloat(i.mapY)) ? Number.parseFloat(i.mapY) : Number.NaN,
      address: i.address,
    }
  })
}

onShow(async () => {
  await loadPageInfo()
})

async function loadPageInfo() {
  // 获取停车场信息
  RunGetParkAreaList()
  // 获取车辆处理记录
  if (isChengguan.value) {
    await RunGetVehicleProcessList()
  }
  else {
    // 获取停车坐标，推算当前距离
    // 获取定位信息
    GetLocation()
    calculateDistances(LocationInfo.value, handleParkAreaList(parkAreaList.value))
    console.log('closestLocation', closestLocation.value)
    // 获取当前用户是否非法停车 发送挪车消息
    await getUserIllegalityPollUp()
  }
}

function clickCavigateTo(url: string) {
  uni.navigateTo({ url })
}
</script>

<template>
  <wd-notice-bar text="这是一条消息提示信息，这是一条消息提示信息，这是一条消息提示信息" prefix="check-outline" type="warning" />
  <view v-if="isChengguan !== undefined" class="flex justify-center bg-white">
    <!-- 用户 -->
    <view v-if="!isChengguan" class="text-center text-[14px]">
      <view>
        地铁站:
        <view>{{ closestLocation.address }}, 距离: {{ closestLocation.distance }} m</view>
        <!-- <text>{{ closestLocation.address }}, 距离: {{ distance }}</text> -->
      </view>
      <view class="m-[4px] p-[4px]">
        <wd-button plain>
          周边停车点位
        </wd-button>
        <wd-button plain @click="clickCavigateTo('/pages/find/index')">
          找车
        </wd-button>
      </view>
    </view>

    <!-- 城管 -->
    <view v-else class="flex justify-between text-[14px]">
      <view class="flex flex-col gap-[4px] m-[6px]">
        <view class="text-center" style="">
          停车场状态
        </view>
        <template v-for="item in parkAreaList" :key="item.parkAreaID">
          <view>
            <text>{{ item.address }}</text>
            <text v-if="item.spaceBalance === 0">
              空闲
            </text>
            <text v-else>
              爆满
            </text>
          </view>
        </template>
        <wd-button plain size="small">
          附近停车点位
        </wd-button>
      </view>

      <!-- 城管巡视状态 -->
      <view class="flex flex-col gap-[4px] m-[6px]">
        <view style="text-align: center;">
          今日任务
        </view>
        <view>今天巡视次数: {{ instanceNum }}, 异常次数: {{ instanceExectionNum }} </view>
        <view>今日挪车次数: {{ VehicleProcessNum }}, 车辆: {{ ViolationNum }}</view>
        <view v-if="checkButton">
          <wd-button v-if="instanceNum === 0" plain size="small" @click="clickCavigateTo('/pages/inspection/dot')">
            开始巡视
          </wd-button>
          <wd-button v-else plain size="small" @click="clickCavigateTo('/pages/move/index')">
            开始挪车
          </wd-button>
        </view>
        <view v-else style="display: flex; gap: 4px;">
          <wd-button plain size="small" custom-class="flex-1" @click="clickCavigateTo('/pages/move/take')">
            继续拍照
          </wd-button>
          <wd-button plain size="small" custom-class="flex-1">
            停车场
          </wd-button>
        </view>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>

</style>

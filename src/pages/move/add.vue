<route lang="json5" type="page">
{
  layout: 'page',
  style: {
    navigationBarTitleText: '巡检路线',
  },
}
</route>

<script lang="ts" setup>
import type * as Move from '@/service/static/move.type'
import type * as Other from '@/service/static/other.type'
import { createOneVehicleProcess } from '@/service/static/move'
import { submObjectAttachment } from '@/service/static/other'
import dayjs from 'dayjs'
import { useMessage, useToast } from 'wot-design-uni'

const message = useMessage()
const toast = useToast()

// const { locationInfo } = storeToRefs(useOtherStore())
// const { GetLocation } = useOtherStore()

const { parkAreaList, handleParkArea } = storeToRefs(useMoveStore())
const { RunGetParkAreaList } = useMoveStore()
const { loading, run: RunUpload } = useUpload({ fileBucketID: FILEBUCKETID })

const OneVehicleProcess = ref()

onLoad(() => {
  // GetLocation()
  RunGetParkAreaList()
})

async function onConfirm() {
  console.log('onConfirm')

  // console.log(parkAreaID.value)
  // const res = await RunGetParkUnitList()
  // console.log(res)
}

// 停车区全景图片
const panoramicPhotoList = ref<string[]>([
  'http://3onepicture.3onedataqz.com/cb6babc33a2044d89942ffc84db90502.jpg',
  'http://3onepicture.3onedataqz.com/eda7327a142c4bd5995a8e7be4c3fb3c.jpg',
])
async function onPanoramicPhoto() {
  const ImageData = await RunUpload()
  ImageData && panoramicPhotoList.value.unshift(ImageData.filesURL)
}

function rmPanoramicPhoto(idx: number) {
  message.confirm({ msg: '是否删除当前图片', title: '提示' }).then(() => {
    panoramicPhotoList.value?.splice(idx, 1)
    toast.success('删除成功')
  })
}

// 下一步
async function onNext() {
  console.log('下一步', handleParkArea.value)
  if (!handleParkArea.value)
    return toast.warning('选择当前停车场')
  if (!panoramicPhotoList.value.length)
    return toast.warning('上传停车场违停照片')

  const VehicleProcessName = `挪车-${dayjs().format('YYYY-MM-DD HH:mm:ss')}`
  const OneVehicleProcessParams = ref<Move.CreateOneVehicleProcessType | undefined>()
  OneVehicleProcessParams.value = { name: VehicleProcessName }
  // 创建一个车辆处理记录
  const { data, run } = useRequest(() => createOneVehicleProcess(OneVehicleProcessParams.value))
  await run()
  OneVehicleProcess.value = data.value

  const AttachmentParams = ref<Other.IAttachmentParams | undefined>()
  // 上传图片附
  const ReqList = panoramicPhotoList.value.map((src) => {
    AttachmentParams.value = {
      objectID: data.value.vehicleProcessId,
      objectName: VehicleProcessName,
      imageUrl: src,
      objectDefineID: ObjectDefineIDEnum.挪车全景图,
    }
    return submObjectAttachment(AttachmentParams.value)
  })

  Promise.all(ReqList).then(() => {
    uni.navigateTo({ url: '/pages/move/take' })
  })
}

function onTake() {
  useMoveTask().vehicleProcessID = OneVehicleProcess.value.vehicleProcessId
  uni.navigateTo({ url: '/pages/move/take' })
}
</script>

<template>
  <template v-if="panoramicPhotoList.length">
    <view class="p-2 text-center bg-[#f1f1f1]">
      已上传 {{ panoramicPhotoList.length }} 张图片
    </view>

    <view class="flex-1 overflow-y-auto flex flex-col gap-4">
      <template v-for="(src, idx) in panoramicPhotoList" :key="src">
        <wd-img class="w-full" mode="widthFix" :src="src" enable-preview @longpress="rmPanoramicPhoto(idx)" />
      </template>
    </view>
  </template>

  <template v-else>
    <view class="flex-1 flex flex-col justify-center items-center gap-2" @click="onPanoramicPhoto">
      <view class="i-tabler:ruler-measure text-20" />
      <text class="mb-5 text-10">
        10 M
      </text>
      <text>请在10米左右</text>
      <text>拍摄当前停车区域的全景照片</text>
      <text>可显示乱停的情况</text>
    </view>
  </template>

  <view>
    <view>handleParkArea：{{ handleParkArea }}</view>
  </view>

  <view class="my-2 flex flex-col gap-2">
    <wd-picker v-model="handleParkArea" :columns="parkAreaList" label="挪车区域" align-right @confirm="onConfirm" />

    <view class="flex justify-between gap-2">
      <wd-button custom-class="w-full" size="large" @click="onPanoramicPhoto">
        拍摄全景照片
      </wd-button>
      <wd-button custom-class="w-full" size="large" @click="onNext">
        下一步
      </wd-button>
      <wd-button custom-class="w-full" size="large" @click="onTake">
        任务
      </wd-button>
    </view>
  </view>

  <wd-overlay :show="loading">
    <view class="flex items-center justify-center h-full">
      <wd-loading />
    </view>
  </wd-overlay>
</template>

<style lang="scss" scoped>

</style>

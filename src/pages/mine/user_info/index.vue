<route lang="json5">
    {
      style: {
        navigationBarTitleText: '个人信息',
      },
    }
</route>

<script setup lang="ts">
import { getPropertyList } from '@/service/static/index'
import { updateMyMemberAvatar, updateMyMemberPropertyID, updateMyMemberShortname } from '@/service/static/user'
import { useUserStore } from '@/store/user'
import { storeToRefs } from 'pinia'

const userStore = useUserStore()
const { OneMemberDetail: userInfo } = storeToRefs(userStore)
onLoad(() => {
  getPropertyOptions()
})

// 图像
// 计算属性，返回图片的路径
const avatarSrc = computed(() => {
  if (!userInfo.value.avatarURL) {
    console.log('头像为空')
    console.log(userInfo.value.avatarURL)
  }
  return userInfo.value.avatarURL || 'https://imgs.699pic.com/images/500/465/562.jpg!list1x.v2'
})

// 上传图片
const { data, run: RunImageData } = useUpload({
  fileBucketID: FILEBUCKETID,
})
// 点击事件，修改头像
async function onEditAvatar() {
  console.log('点击事件，修改头像')
  console.log(avatarSrc.value)
  const imageData = await RunImageData()
  data.value = imageData
  console.log('头像修改成功')
  console.log(data.value)
  updateMyMemberAvatar(data.value.filesURL)
  userStore.RunGetOneMemberDetail()
}

// 昵称
// 点击事件，弹窗，修改昵称
const nickname = ref(userInfo.value.shortName)
const namePopup = ref(false)

const convertName = computed(() => {
  return nickname.value.length >= 2 && nickname.value !== userInfo.value.shortName
})

function onEditName() {
  namePopup.value = true
}

async function onNameConfirm() {
  const { loading, run } = useRequest(() => updateMyMemberShortname(nickname.value))
  await run()
  console.log('昵称修改成功', loading)
  userStore.RunGetOneMemberDetail()
  namePopup.value = false
}

// 居住小区
const propertyOptions = ref([])
const propertyItems = ref([])

async function getPropertyOptions() {
  const { data: CommunityAddressList, run } = useRequest(() => getPropertyList())
  await run()
  console.log(CommunityAddressList.value.rows)
  propertyOptions.value = CommunityAddressList.value.rows.map((item) => {
    return item.name
  })
  propertyItems.value = CommunityAddressList.value.rows
}
const propertyValue = computed(() => {
  const adderItem = propertyItems.value?.find(item => item.propertyID === userStore.OneMemberDetail.propertyID)
  return adderItem ? adderItem.name : void 0
})
async function onPropertyChange({ value }) {
  const adderItem = propertyItems.value?.find(item => item.name === value)
  const { data, run } = useRequest(() => updateMyMemberPropertyID(adderItem.propertyID))
  await run()
  console.log('修改成功', data)
  userStore.RunGetOneMemberDetail()
  // 弹窗框
}
</script>

<template>
  <view>
    <!-- 个人信息列表 -->
    <wd-cell-group border use-slot>
      <wd-cell title="头像" is-link center @click="onEditAvatar">
        <template #default>
          <wd-img round :src="avatarSrc" :width="50" :height="50" />
        </template>
      </wd-cell>
      <wd-cell title="昵称" :value="userInfo.shortName" is-link @click="onEditName" />
      <wd-cell title="手机号" :value="userInfo.phone" clickable />
      <wd-picker v-model="propertyValue" :columns="propertyOptions" label="居住小区" align-right
        @confirm="onPropertyChange" />
    </wd-cell-group>
  </view>

  <!-- 修改昵称弹窗 -->
  <wd-overlay :show="namePopup" @click="namePopup = false">
    <view class="flex items-center justify-center h-full">
      <view class="flex-col items-center flex p-4  shadow-[0px_0px_12px_0px_#00000033] rounded-2 bg-white"
        @click.stop="">
        <text class="text-3.5">
          修改昵称
        </text>
        <input v-model="nickname" class="rounded-[6px] bg-[#eee] my-3 h-8 text-3 p-1" focus placeholder="请输入昵称">
        <view>
          <view class="c-pink text-3">
            *以英文字母或者汉字开头
          </view>
          <view class="c-pink text-3">
            *限4-16个字符，一个汉字为2个字符.
          </view>
        </view>
        <wd-button class="top-2" :disabled="!convertName" size="small" @click="onNameConfirm">
          提交
        </wd-button>
      </view>
    </view>
  </wd-overlay>
</template>

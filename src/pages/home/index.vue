<route lang="json5" type="home">
{
  layout: 'tabbar',
  style: {
    navigationBarTitleText: '首页',
  },
}
</route>

<script lang="ts" setup>
import StatusInfo from '@/pages/home/statusInfo.vue'

import { getFocusPictureList, getNoticeArticleList } from '@/service/static'
import ArticleWrap from './components/ArticleWrap.vue'
import chengguan from './components/chengguan.vue'
import SearchWrap from './components/SearchWrap.vue'

const { isLogined } = storeToRefs(useUserStore())
// 轮播图
const { data: PictureList } = useRequest(() => getFocusPictureList(), { immediate: true })
const pictureList = computed(() => PictureList.value?.rows.map(i => i.picturePath))
const indicator = { type: 'dots-bar' } as any

// 通知
const { data: NoticeArticleList } = useRequest(() => getNoticeArticleList(), { immediate: true })
const noticeArticleList = computed(() => NoticeArticleList.value?.rows.map(i => i.title))

function onSearch() {
  uni.navigateTo({ url: '/pages/home/search' })
}

function onNotice({ index, title }) {
  console.log('onNotice', { index, title }, NoticeArticleList.value.rows?.[index])
}
</script>

<template>
  <SearchWrap @search="onSearch" />

  <view class="flex-1 overflow-y-auto flex flex-col gap-2 p-4">
    <wd-swiper :list="pictureList" autoplay :indicator="indicator" />

    <wd-notice-bar
      type="info"
      prefix="notification"
      direction="vertical"
      :text="noticeArticleList"
      :delay="3"
      @click="onNotice"
    />

    <StatusInfo v-if="isLogined" />

    <chengguan />

    <ArticleWrap />
  </view>
</template>

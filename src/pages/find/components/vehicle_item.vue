<!--
 * @Author: OneWafer
 * @Date: 2025-01-20 01:46:36
 * @LastEditors: OneWafer
 * @LastEditTime: 2025-01-24 15:41:23
 * @Description: Do not edit
-->
<script setup>
// import { sizeEnum } from './helper.js'

defineProps(['item'])
// const emit = defineEmits(['onClick'])

// function handleClick() {
//     emit('onClick')
// }
</script>

<template>
    <view class="item-wrap">
        <img :src="item?.faceImage" alt="">
        <view class="info-wrap">
            <view class="info-item">
                <text class="title">
                    车牌
                </text>
                <text class="value">
                    {{ item?.sequenceCode || '--' }}
                </text>
            </view>

            <view class="bottom-wrap">
                <view class="info-item">
                    <text class="title">
                        品牌
                    </text>
                    <text class="value">
                        {{ item?.brandName || '--' }}
                    </text>
                </view>
                <view class="info-item">
                    <text class="title">
                        车型
                    </text>
                    <text class="value">
                        {{ sizeEnum[item?.sizeType] || '--' }}
                    </text>
                </view>
                <view class="info-item">
                    <text class="title">
                        颜色
                    </text>
                    <text class="value">
                        {{ item?.color || '--' }}
                    </text>
                </view>
            </view>
        </view>
    </view>
</template>

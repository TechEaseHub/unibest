# Clipper 图片裁剪
> 图片裁剪，可用于图片头像等裁剪处理  

## 平台兼容

| H5  | 微信小程序 | 支付宝小程序 | 百度小程序 | 头条小程序 | QQ 小程序 | App |
| --- | ---------- | ------------ | ---------- | ---------- | --------- | --- |
| √   | √          | √         | 未测       | √          | √      | √   |

## 安装
插件市场导入即可

## 文档
[clipper](https://limex.qcoon.cn/components/clipper.html)

## 代码演示
### 基本用法
`@success` 事件点击 👉 **确定** 后会返回生成的图片信息，包含 `url`、`width`、`height`

```html
<image :src="url" v-if="url" mode="widthFix"></image>
<l-clipper v-if="show" @success="url = $event.url; show = false" @cancel="show = false"  />
<button @tap="show = true">裁剪</button>
```

```js
export default {
    data() {
        return {
            show: false,
			url: '',
        }
    }
}
```


### 传入图片
`image-url`可传入**相对路径**、**临时路径**、**本地路径**、**网络图片**<br>

* **当为网络地址时**
* H5：👉 需要解决跨域问题。 <br>
* 小程序：👉 需要配置 downloadFile 域名 <br>


```html
<image :src="url" v-if="url" mode="widthFix"></image>
<l-clipper v-if="show" :image-url="imageUrl"  @success="url = $event.url; show = false" @cancel="show = false"  />
<button @tap="show = true">裁剪</button>
```

```js
export default {
    data() {
        return {
			imageUrl: 'https://img12.360buyimg.com/pop/s1180x940_jfs/t1/97205/26/1142/87801/5dbac55aEf795d962/48a4d7a63ff80b8b.jpg',
            show: false,
			url: '',
        }
    }
}
```


### 确定按钮颜色

```html
<l-clipper class="clipper" confirm-bg-color="linear-gradient(to right, #ff6034, #ee0a24)"  />
```



### 使用插槽
共五个插槽 `cancel` 取消按钮、 `photo` 选择图片按钮、 `rotate` 旋转按钮、 `confirm` 确定按钮和默认插槽。

```html
<image :src="url" v-if="url" mode="widthFix"></image>
<l-clipper 
	v-if="show" 
	:isLockWidth="isLockWidth"
	:isLockHeight="isLockHeight"
	:isLockRatio="isLockRatio"
	:isLimitMove="isLimitMove"
	:isDisableScale="isDisableScale"
	:isDisableRotate="isDisableRotate"
	:isShowCancelBtn="isShowCancelBtn"
	:isShowPhotoBtn="isShowPhotoBtn"
	:isShowRotateBtn="isShowRotateBtn"
	:isShowConfirmBtn="isShowConfirmBtn"
	@success="url = $event.url; show = false" 
	@cancel="show = false" >
	<!-- 四个基本按钮插槽 -->
	<view slot="cancel">取消</view>
	<view slot="photo">选择图片</view>
	<view slot="rotate">旋转</view>
	<view slot="confirm">确定</view>
	<!-- 默认插槽 -->
	<view class="tools" style="flex-direction: row; flex-wrap: wrap;">
	<view>
		<text style="color: white;">显示取消按钮{{isShowCancelBtn}}</text>
		<switch :checked="isShowCancelBtn" @change="($event: UniSwitchChangeEvent) => {isShowCancelBtn = $event.detail.value}"/>
	</view>
	<view>
		<text style="color: white;">显示选择图片按钮</text>
		<switch :checked="isShowPhotoBtn" @change="($event: UniSwitchChangeEvent) => {isShowPhotoBtn = $event.detail.value}" />
	</view>
	<view>
		<text style="color: white;">显示旋转按钮</text>
		<switch :checked="isShowRotateBtn" @change="($event: UniSwitchChangeEvent) => {isShowRotateBtn = $event.detail.value}" />
	</view>
	<view>
		<text style="color: white;">显示确定按钮</text>
		<switch :checked="isShowConfirmBtn" @change="($event: UniSwitchChangeEvent) => {isShowConfirmBtn = $event.detail.value}" />
	</view>
	<view>
		<text style="color: white;">锁定裁剪框宽度</text>
		<switch :checked="isLockWidth" @change="($event: UniSwitchChangeEvent) => {isLockWidth = $event.detail.value}" />
	</view>
	<view>
		<text style="color: white;">锁定裁剪框高度</text>
		<switch :checked="isLockHeight" @change="($event: UniSwitchChangeEvent) => {isLockHeight = $event.detail.value}" />
	</view>
	<view>
		<text style="color: white;">锁定裁剪框比例</text>
		<switch :checked="isLockRatio" @change="($event: UniSwitchChangeEvent) => {isLockRatio = $event.detail.value}" />
	</view>
	<view>
		<text style="color: white;">限制移动范围</text>
		<switch :checked="isLimitMove" @change="($event: UniSwitchChangeEvent) => {isLimitMove = $event.detail.value}" />
	</view>
	<view>
		<text style="color: white;">禁止缩放</text>
		<switch :checked="isDisableScale" @change="($event: UniSwitchChangeEvent) => {isDisableScale = $event.detail.value}" />
	</view>
	<view>
		<text style="color: white;">禁止旋转</text>
		<switch :checked="isDisableRotate" @change="($event: UniSwitchChangeEvent) => {isDisableRotate = $event.detail.value}" />
	</view>
</view>
</l-clipper>
<button @tap="show = true">裁剪</button>
```

```js
export default {

    data() {
        return {
            show: false,
            url: '',
            isLockWidth: false,
            isLockHeight: false,
            isLockRatio: true,
            isLimitMove: false,
            isDisableScale: false,
            isDisableRotate: false,
            isShowCancelBtn: true,
            isShowPhotoBtn: true,
            isShowRotateBtn: true,
            isShowConfirmBtn: true
        }
    }
}
```

### 查看示例
- 导入后直接使用这个标签查看演示效果

```html
<!-- // 代码位于 uni_modules/lime-clipper/compoents/lime-clipper -->
<lime-clipper />
```


### 插件标签
- 默认 l-clipper 为 component
- 默认 lime-clipper 为 demo




## API

### Props

| 参数           | 说明         | 类型             | 默认值       |
| ------------- | ------------ | ---------------- | ------------ |
| image-url     | 图片路径     | <em>string</em>   |              |
| quality       | 图片的质量，取值范围为 [0, 1]，不在范围内时当作1处理   | <em>number</em>  |    `1`      |
| source       | `{album: '从相册中选择'}`key为图片来源类型，value为选项说明   | <em>Object</em>  |         |
| width | 裁剪框宽度，单位为 `rpx` | <em>number</em> | `400`      |
| height | 裁剪框高度 | <em>number</em> | `400`      |
| min-width | 裁剪框最小宽度 | <em>number</em> | `200`      |
| min-height |裁剪框最小高度 | <em>number</em> | `200`  |
| max-width | 裁剪框最大宽度 | <em>number</em> | `600`  |
| max-height | 裁剪框最大宽度 | <em>number</em> | `600`  |
| min-ratio | 图片最小缩放比 | <em>number</em> | `0.5`  |
| max-ratio | 图片最大缩放比 | <em>number</em> | `2`  |
| rotate-angle | 旋转按钮每次旋转的角度 | <em>number</em> | `90`  |
| scale-ratio | 生成图片相对于裁剪框的比例， **比例越高生成图片越清晰**	 | <em>number</em> | `1`  |
| is-lock-width | 是否锁定裁剪框宽度 | <em>boolean</em> | `false`  |
| is-lock-height | 是否锁定裁剪框高度上 | <em>boolean</em> | `false`  |
| is-lock-ratio | 是否锁定裁剪框比例 | <em>boolean</em> | `true`  |
| is-disable-scale | 是否禁止缩放 | <em>boolean</em> | `false`  |
| is-disable-rotate | 是否禁止旋转 | <em>boolean</em> | `false`  |
| is-limit-move | 是否限制移动范围 | <em>boolean</em> | `false`  |
| is-show-photo-btn | 是否显示选择图片按钮 | <em>boolean</em> | `true`  |
| is-show-rotate-btn | 是否显示转按钮 | <em>boolean</em> | `true`  |
| is-show-confirm-btn | 是否显示确定按钮 | <em>boolean</em> | `true`  |
| is-show-cancel-btn | 是否显示关闭按钮 | <em>boolean</em> | `true`  |
| confirm-bg-color | 确定按钮背景色 | <em>string</em> | ``  |



### 事件 Events

| 事件名  | 说明         | 回调           |
| ------- | ------------ | -------------- |
| success | 生成图片成功 | {`width`, `height`, `url`} |
| fail | 生成图片失败 | `error` |
| cancel | 关闭 | `false` |
| ready   | 图片加载完成 | {`width`, `height`, `path`, `orientation`, `type`} |
| change | 图片大小改变时触发 | {`width`, `height`} |
| rotate | 图片旋转时触发 | `angle` |

## 常见问题
- 1、H5端使用网络图片需要解决跨域问题。
- 2、小程序使用网络图片需要去公众平台增加下载白名单！二级域名也需要配！
- 3、H5端生成图片是base64，有时显示只有一半可以使用原生标签`<IMG/>`
- 4、IOS APP 请勿使用HBX2.9.3.20201014的版本！这个版本无法生成图片。
- 5、APP端无成功反馈、也无失败反馈时，请更新基座和HBX。


## 打赏
如果你觉得本插件，解决了你的问题，赠人玫瑰，手留余香。  
![](https://testingcf.jsdelivr.net/gh/liangei/image@1.9/alipay.png)
![](https://testingcf.jsdelivr.net/gh/liangei/image@1.9/wpay.png)
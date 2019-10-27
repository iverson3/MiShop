<template>
	<view>
		<view style="line-height: 1;display: inline-block;background: #007AFF;width: 187.5upx; height: 150upx;"></view>
		<view style="line-height: 1;display: inline-block;background: red;width: 187.5upx; height: 150upx;"></view>
		<view style="line-height: 1;display: inline-block;background: green;width: 375upx; height: 150upx;"></view>
		
		
		<view class="">
			<text>{{ text }} - {{ text2 }}</text>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				text: '11111',
				text2: '11111'
			}
		},
		onLoad: function() {
			// 监听自定义的全局事件，事件可以由 uni.$emit() 触发
			// 回调函数会接收 uni.$emit() 传递的参数
			uni.$on('index', e => {
				console.log('class page')
				console.log(e)
				this.text = e.data
			})
			
			// 获取存储的数据
			let data = uni.getStorageSync('index')
			console.log(data)
		},
		onShow: function() {
			// 获取全局变量
			let text = getApp().globalData.text
			this.text2 = text
		},
		methods: {
			
		}
	}
</script>

<style>

</style>

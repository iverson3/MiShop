<template>
	<view>
		<button @click="ceshi" type="primary">修改首页数据</button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				text: "111",
				text2: "222"
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
			ceshi: function() {
				let pages = getCurrentPages()
				let index = pages[0].$getAppWebview()
				console.log(index)
				// 发送数据到nvue页面
				plus.webview.postMessageToUniNView({
					res: 'ceshi'
				}, index.id)
				uni.navigateBack()
			}
		}
	}
</script>

<style>

</style>

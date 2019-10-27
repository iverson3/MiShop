<template>
	<view>
		<button @click="ceshi" type="primary">修改首页数据</button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			}
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

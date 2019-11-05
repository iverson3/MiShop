<template>
	<view>
		
		<view class="d-flex flex-column j-center a-center py-5 my-3">
			<text class="iconfont icon-iconfontxuanzhong4 line-h" style="font-size: 130upx;color:#09BB07;"></text>
			<text class="font-lg text-dark line-h-md mt-1">支付成功</text>
		</view>
		
		<view class="px-5">
			<view class="w-100 main-bg-color py-2 rounded font-md text-white d-flex j-center mt-3"
			@tap="openOrderDetail"
			hover-class="main-bg-hover-color">
				查看订单
			</view>
			<view class="w-100 py-2 rounded border font-md text-dark d-flex j-center mt-3"
			@tap="openIndex"
			hover-class="bg-light-secondary">
				返回首页
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		methods: {
			openOrderDetail: function() {
				uni.navigateTo({
					url: "/pages/order-detail/order-detail"
				})
			},
			openIndex: function() {
				uni.switchTab({
					url: "/pages/index/index"
				})
			}
		}
	}
</script>

<style>

</style>

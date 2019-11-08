<template>
	<view>
		
		<view class="d-flex flex-column j-center a-center py-5 my-3">
			<text class="iconfont line-h" :class="payres === 1?'icon-iconfontxuanzhong4':'icon-shanchu'" :style="getStyle"></text>
			<text class="font-lg text-dark line-h-md mt-1">{{ payres === 1? '支付成功':'支付失败' }}</text>
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
				orderid: 0,
				payres: 0
			}
		},
		computed: {
			getStyle() {
				let color = "#09BB07"
				if (this.payres !== 1) color = "#f00"
				return `font-size: 130upx;color:${color};`
			}
		},
		onLoad: function(e) {
			if (e.orderid && e.payres) {
				this.orderid = parseInt(e.orderid)
				this.payres  = parseInt(e.payres)
			}
		},
		methods: {
			openOrderDetail: function() {
				uni.redirectTo({
					url: "/pages/order-detail/order-detail?orderid=" + this.orderid
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

<template>
	<view>
		<view class="py-5 d-flex flex-column j-center a-center my-3">
			<text class="text-light-muted font-md mb-1">支付金额</text>
			<price priceSize="font-lg" unitSize="font-md">38.00</price>
		</view>
		
		<view class="px-5">
			<label>
				<uni-list-item leftIcon="icon-zhifubao text-primary"
				title="支付宝支付" note="推荐使用支付宝支付" 
				leftIconStyle="font-size:60upx;"
				:showExtraIcon="true">
					<radio slot="right" value="1" color="#FD6801" />
				</uni-list-item>
			</label>
			<label>
				<uni-list-item leftIcon="icon-weixinzhifu text-success"
				title="微信支付"
				leftIconStyle="font-size:60upx;"
				:showExtraIcon="true">
					<radio slot="right" value="2" color="#FD6801" />
				</uni-list-item>
			</label>
			
			<view class="w-100 main-bg-color py-2 rounded font-md text-white d-flex j-center mt-3" 
			@tap="confirmPay"
			hover-class="main-bg-hover-color">
				确认支付
			</view>
		</view>
	</view>
</template>

<script>
	import price from '@/components/common/price.vue';
	import uniListItem from '@/components/uni-ui/uni-list-item/uni-list-item.vue';
	
	export default {
		components: {
			price,
			uniListItem
		},
		data() {
			return {
				orderid: 0
			}
		},
		onLoad: function(e) {
			if (e.orderid) {
				this.orderid = e.orderid
			}
		},
		onBackPress: function() {
			let pages = getCurrentPages()
			// 如果上一个页面是订单详情页或订单列表页，那么直接返回
			if (pages[pages.length - 2].route === 'pages/order-detail/order-detail') return false
			if (pages[pages.length - 2].route === 'pages/order/order') return false
			
			uni.showModal({
				content: '确定要放弃支付吗？',
				success: res => {
					if (res.confirm) {
						// 用户选择放弃支付 则直接跳转到订单详情页 并显示该订单处于待支付状态
						uni.redirectTo({url: "/pages/order-detail/order-detail?orderid=" + this.orderid});
					}
				}
			});
			return true
		},
		methods: {
			confirmPay: function() {
				uni.redirectTo({
					url: "/pages/pay-result/pay-result"
				})
			}
		}
	}
</script>

<style>

</style>

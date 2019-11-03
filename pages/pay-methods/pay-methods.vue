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
				
			}
		},
		methods: {
			confirmPay: function() {
				uni.navigateTo({
					url: "/pages/pay-result/pay-result"
				})
			}
		}
	}
</script>

<style>

</style>

<template>
	<view>
		<view class="py-5 d-flex flex-column j-center a-center my-3">
			<text class="text-light-muted font-md mb-1">支付金额</text>
			<price priceSize="font-lg" unitSize="font-md">{{ orderInfo.pay_price }}</price>
		</view>
		
		<view class="px-5">
			<radio-group @change="changePayMethod">
				<label v-for="(item,index) in options" :key="index">
					<uni-list-item :leftIcon="item.icon" :title="item.title" :note="item.note" 
					leftIconStyle="font-size:60upx;" :showExtraIcon="true">
						<radio slot="right" :value="item.value" :checked="payMethod === item.value" color="#FD6801" />
					</uni-list-item>
				</label>
			</radio-group>
			
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
	
	import {mapGetters, mapMutations} from 'vuex'
	export default {
		components: {
			price,
			uniListItem
		},
		data() {
			return {
				orderInfo: {},
				payMethod: "alipay",
				options: [{
						title: "支付宝支付",
						note: "推荐使用支付宝支付",
						icon: "icon-zhifubao text-primary",
						value: "alipay"
					},{
						title: "微信支付",
						note: "",
						icon: "icon-weixinzhifu text-success",
						value: "wxpay"
					}
				]
			}
		},
		computed: {
			...mapGetters(['getOrderInfoById'])
		},
		onLoad: function(e) {
			if (e.orderid) {
				this.orderInfo = this.getOrderInfoById(parseInt(e.orderid))
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
						uni.redirectTo({url: "/pages/order-detail/order-detail?orderid=" + this.orderInfo.id});
					}
				}
			});
			return true
		},
		methods: {
			...mapMutations(['changeOrderStatus']),
			
			changePayMethod: function(e) {
				this.payMethod = e.detail.value
			},
			confirmPay: function() {
				// 支付结果 1-成功 2-失败
				let payres = 1
				
				let rand = Math.floor(Math.random() * 10)
				if (rand < 5) payres = 2
				
				if (payres === 1) {
					// 支付成功 则修改订单状态为待发货
					let new_status = 2
					if (rand % 2 === 0) new_status = 3
					this.changeOrderStatus({
						id: this.orderInfo.id,
						old_status: this.orderInfo.statusNo,
						new_status: new_status
					})
				} else {
					// 支付失败 则修改订单状态为支付失败
					this.changeOrderStatus({
						id: this.orderInfo.id,
						old_status: this.orderInfo.statusNo,
						new_status: 5
					})
				}
				uni.redirectTo({
					url: `/pages/pay-result/pay-result?orderid=${this.orderInfo.id}&payres=${payres}`
				})
			}
		}
	}
</script>

<style>

</style>

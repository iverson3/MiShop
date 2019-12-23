<template>
	<view>
		<view class="py-5 d-flex flex-column j-center a-center my-3">
			<text class="text-light-muted font-md mb-1">支付金额</text>
			<price priceSize="font-lg" unitSize="font-md">{{ price }}</price>
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
			
			<view class="w-100 py-2 rounded font-md text-white d-flex j-center mt-3" 
			@tap="confirmPay" :class="paying? 'bg-secondary' : 'main-bg-color'"
			hover-class="main-bg-hover-color">
				{{ paying ? '支付中...' : '确认支付'}}
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
				orderid: 0,
				price: 0,
				payMethod: "alipay",
				paying: false,
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
			if (e.orderid && e.price) {
				this.orderid = parseInt(e.orderid)
				this.price = parseFloat(e.price)
			} else {
				uni.showToast({title: '出现未知错误，请重新下单', icon: 'none'});
				uni.navigateBack({delta: 1});
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
			...mapMutations(['changeOrderStatus']),
			
			changePayMethod: function(e) {
				this.payMethod = e.detail.value
			},
			confirmPay: function() {
				if (this.paying) return
				this.paying = true
				
				// 从服务端获取支付数据
				this.$api.get('/payment/' + this.orderid + '/' + this.payMethod, {}, {
					token: true,
					toast: false,
					native: true
				}).then(res => {
					
					// 发起支付请求
					uni.requestPayment({
						provider: this.payMethod, // 支付方式
						orderInfo: res.data,  // 微信、支付宝订单数据
						success: res => {
							console.log(res);
							// 支付成功 则修改订单状态为待发货
							// this.changeOrderStatus({
							// 	id: this.orderInfo.id,
							// 	old_status: this.orderInfo.statusNo,
							// 	new_status: 3
							// })
							
							uni.redirectTo({
								url: `/pages/pay-result/pay-result?orderid=${this.orderid}&payres=1`
							})
						},
						fail: (err) => {
							console.log(err);
							uni.showModal({
								title: "提示",
								content: "支付失败",
								showCancel: false
							})
							
							// 支付失败 则修改订单状态为支付失败
							// this.changeOrderStatus({
							// 	id: this.orderInfo.id,
							// 	old_status: this.orderInfo.statusNo,
							// 	new_status: 5
							// })
							
						},
						complete: () => {
							this.paying = false
						}
					});
					
				}).catch(err => {
					console.log(err);
					this.paying = false
					uni.showToast({
						title: '无法获取支付数据',
						icon: 'none'
					});
				})
			}
		}
	}
</script>

<style>

</style>

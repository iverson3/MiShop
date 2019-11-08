<template>
	<view>
		<view class="main-bg-color p-4 text-white d-flex a-end j-sb" style="height: 300upx;">
			<view class="mb-3">
				<view class="font-lg">{{ statusInfoList[orderInfo.statusNo].title }}</view>
				<view class="font">{{ statusInfoList[orderInfo.statusNo].desc }}</view>
			</view>
			<view class="iconfont line-h mb-3" :class="statusInfoList[orderInfo.statusNo].icon" style="font-size: 100upx;"></view>
		</view>
		
		<view class="p-3">
			<view class="text-light-muted font-md">
				<text class="font-lg text-dark mr-2">{{ pathInfo.name }}</text>
				{{ pathInfo.phone }}
			</view>
			<view class="text-light-muted font-md">
				{{ pathInfo.path }} {{ pathInfo.detailPath }}
			</view>
		</view>
		<divider></divider>
		<view class="px-2">
			<block v-for="(item,index) in orderInfo.order_items" :key="index">
				<order-list-item :goods="item" :index="index"></order-list-item>
			</block>
		</view>
		<divider></divider>
		
		<uni-list-item>
			<text class="font-md text-light-muted">商品总价</text>
			<view slot="right" class="font-md text-light-muted">￥{{ orderInfo.total_price }}</view>
		</uni-list-item>
		<uni-list-item>
			<text class="font-md text-light-muted">快递</text>
			<view slot="right" class="font-md text-light-muted">{{ orderInfo.freight === 0? '免邮' : orderInfo.freight }}</view>
		</uni-list-item>
		<uni-list-item extraWidth="40%">
			<text class="font-md text-light-muted">优惠券</text>
			<view slot="right" class="font-md text-light-muted">{{ orderInfo.coupon_id === 0? '没使用优惠券' : '-￥'+orderInfo.coupon_id }}</view>
		</uni-list-item>
		<uni-list-item>
			<text class="font-md main-text-color">实际付款</text>
			<view slot="right" class="font-md main-text-color">
				<price>{{ orderInfo.pay_price }}</price>
			</view>
		</uni-list-item>
		<divider></divider>
		
		<card headTitle="订单信息">
			<uni-list-item title="订单编号" extraWidth="40%">
				<view slot="right" class="font-md text-light-muted">{{ orderInfo.orderNo }}</view>
			</uni-list-item>
			<uni-list-item title="支付时间" extraWidth="40%">
				<view slot="right" class="font-md text-light-muted">{{ orderInfo.create_time | formatTime }}</view>
			</uni-list-item>
		</card>
		
		
		<divider></divider>
		<!-- 如果是待支付状态 可以取消订单/去支付 -->
		<!-- 如果是支付失败状态 可以去支付/取消订单 -->
		<template v-if="orderInfo.statusNo === 1 || orderInfo.statusNo === 5">
			<view class="w-100 d-flex a-center">
				<view class="flex-1 d-flex a-center j-center py-3 font-md text-white main-bg-color" 
				@tap="openPayMethod(orderInfo.id)"
				hover-class="main-bg-hover-color">去支付</view>
				<view class="flex-1 d-flex a-center j-center py-3 font-md text-white main-bg-color border-left border-light-secondary" 
				@tap="cancelOrder(orderInfo)"
				hover-class="main-bg-hover-color">取消订单</view>
			</view>
		</template>
		
		<!-- 如果是待发货状态 可以取消订单 -->
		<template v-if="orderInfo.statusNo === 2">
			<view class="w-100 d-flex a-center">
				<view class="flex-1 d-flex a-center j-center py-3 font-md text-white main-bg-color" 
				@tap="cancelOrder(orderInfo)"
				hover-class="main-bg-hover-color">取消订单</view>
			</view>
		</template>
		
		<!-- 如果是待收货状态 可以取消订单/确认收货 -->
		<template v-if="orderInfo.statusNo === 3">
			<view class="w-100 d-flex a-center">
				<view @tap="completeOrder(orderInfo)" class="flex-1 d-flex a-center j-center py-3 font-md text-white main-bg-color" 
				hover-class="main-bg-hover-color">确认收货</view>
				<view @tap="openLogistics(orderInfo.id)" class="flex-1 d-flex a-center j-center py-3 font-md text-white main-bg-color border-left border-light-secondary"
				hover-class="main-bg-hover-color">查看物流</view>
				<view class="flex-1 d-flex a-center j-center py-3 font-md text-white main-bg-color border-left border-light-secondary" 
				hover-class="main-bg-hover-color">申请退货退款</view>
			</view>
		</template>
		
		<!-- 如果是待评价状态 可以申请退货/去评价/再买一单 -->
		<template v-if="orderInfo.statusNo === 4">
			<view class="w-100 d-flex a-center">
				<view class="flex-1 d-flex a-center j-center py-3 font-md text-white main-bg-color" 
				hover-class="main-bg-hover-color">再买一单</view>
				<view @tap="toComment(orderInfo.id)" class="flex-1 d-flex a-center j-center py-3 font-md text-white main-bg-color border-left border-light-secondary" 
				hover-class="main-bg-hover-color">去评价</view>
				<view @tap="openAfterSale(orderInfo.id)" class="flex-1 d-flex a-center j-center py-3 font-md text-white main-bg-color border-left border-light-secondary"
				hover-class="main-bg-hover-color">申请售后</view>
			</view>
		</template>
		
		<!-- 如果是已取消状态  可以删除订单/重新下单 -->
		<template v-if="orderInfo.statusNo === 6">
			<view class="w-100 d-flex a-center">
				<view @tap="reOrder(orderInfo)" class="flex-1 d-flex a-center j-center py-3 font-md text-white main-bg-color" 
				hover-class="main-bg-hover-color">重新下单</view>
				<view @tap="deleteOrder(orderInfo.id)" class="flex-1 d-flex a-center j-center py-3 font-md text-white main-bg-color border-left border-light-secondary" 
				hover-class="main-bg-hover-color">删除订单</view>
			</view>
		</template>
		<!-- 如果是退货退款状态 可以退货退款完成 -->
		<template v-if="orderInfo.statusNo === 7">
			<view class="w-100 d-flex a-center">
				<view class="flex-1 d-flex a-center j-center py-3 font-md text-white main-bg-color" 
				hover-class="main-bg-hover-color">退货退款完成</view>
			</view>
		</template>
	</view>
</template>

<script>
	import orderListItem from '@/components/order/order-list-item.vue'
	import uniListItem from '@/components/uni-ui/uni-list-item/uni-list-item.vue'
	import price from '@/components/common/price.vue'
	import card from '@/components/common/card.vue'
	import utils from '@/common/lib/utils.js';
	
	import {mapGetters, mapMutations} from 'vuex'
	export default {
		components: {
			orderListItem,
			uniListItem,
			price,
			card
		},
		data() {
			return {
				orderInfo: {},
				pathInfo: {},
				
				// 状态值： 0-未知 1-待支付 2-待发货 3-待收货 4-待评价 5-支付失败 6-已取消 7-退货退款中
				statusInfoList: [
					{
						title: "未知状态订单",
						desc: "你的订单状态暂时未知，请重试",
						icon: "icon-unknown"
					},
					{
						title: "待支付订单",
						desc: "您还有xxxx时间去进行支付，过期将自动取消",
						icon: "icon-daizhifu"
					},
					{
						title: "待发货订单",
						desc: "您的订单即将发货，请耐心等待",
						icon: "icon-daifahuo"
					},
					{
						title: "卖家已发货",
						desc: "还差7天10时自动确认",
						icon: "icon-daishouhuo"
					},
					{
						title: "待评价订单",
						desc: "快去给订单写个评价吧",
						icon: "icon-daipingjia"
					},
					{
						title: "支付失败",
						desc: "支付失败，请重新支付",
						icon: "icon-daipingjia"
					},
					{
						title: "已取消，交易关闭",
						desc: "取消订单的原因信息",
						icon: "icon-daipingjia"
					},
					{
						title: "退货退款订单",
						desc: "您的订单退货退款请求正在处理中",
						icon: "icon-tuihuo"
					}
				]
			}
		},
		computed: {
			...mapGetters(['getOrderInfoById', 'getPathById'])
		},
		filters: {
			formatTime(value) {
				return utils.gettime(value)
			}
		},
		onLoad: function(e) {
			if (e.orderid) {
				this.orderInfo = this.getOrderInfoById(parseInt(e.orderid))
				this.pathInfo = this.getPathById(this.orderInfo.path_id)
				
				console.log(this.orderInfo);
			}
			// 不同订单状态下 有不同的页面提示信息 有不同的操作按钮
		},
		onBackPress: function() {
			let pages = getCurrentPages()
			// switch (pages[pages.length - 2].route){
			// 	case 'pages/pay-methods/pay-methods':
			// 		uni.reLaunch({
			// 			url: "/pages/order/order?tab=1"
			// 		})
			// 		return true
			// 		break;
			// 	case 'pages/pay-result/pay-result':
			// 		uni.reLaunch({
			// 			url: "/pages/order/order?tab=2",
			// 		})
			// 		return true
			// 		break;
			// 	default:
			// 		break;
			// }
			return false
		},
		methods: {
			...mapMutations(['changeOrderStatus', 'deleteOrderById', 'reCreateOrder']),
			
			// 查看物流
			openLogistics: function(id) {
				uni.navigateTo({
					url: "/pages/logistics-detail/logistics-detail?orderid=" + id
				})
			},
			// 申请售后
			openAfterSale: function(id) {
				uni.navigateTo({
					url: "/pages/after-sale/after-sale?orderid=" + id
				})
			},
			// 去支付
			openPayMethod: function(id) {
				uni.navigateTo({
					url: "/pages/pay-methods/pay-methods?orderid=" + id
				});
			},
			// 确认收货
			completeOrder: function(item) {
				this.changeOrderStatus({
					id: item.id,
					old_status: item.statusNo,
					new_status: 4
				})
				uni.showToast({title: '订单已完成', icon: 'none'});
			},
			// 取消订单
			cancelOrder: function(item) {
				this.changeOrderStatus({
					id: item.id,
					old_status: item.statusNo,
					new_status: 6
				})
				uni.showToast({title: '取消成功', icon: 'none'});
			},
			// 重新下单
			reOrder: function(item) {
				this.reCreateOrder(item)
				uni.navigateTo({
					url: '/pages/order-confirm/order-confirm'
				});
			},
			// 去评价
			toComment: function(id) {
				uni.navigateTo({
					url: '/pages/comment/comment?orderid=' + id
				});
			},
			// 删除订单
			deleteOrder: function(id) {
				this.deleteOrderById(id)
				uni.showToast({title: '删除成功', icon: 'none'});
				uni.navigateBack({delta: 1});
			},
			
		}
	}
</script>

<style>

</style>

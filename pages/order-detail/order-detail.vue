<template>
	<view>
		<view class="main-bg-color p-4 text-white d-flex a-end j-sb" style="height: 300upx;">
			<view class="mb-3">
				<view class="font-lg">{{ statusInfoList[orderStatus].title }}</view>
				<view class="font">{{ statusInfoList[orderStatus].desc }}</view>
			</view>
			<view class="iconfont line-h mb-3" :class="statusInfoList[orderStatus].icon" style="font-size: 100upx;"></view>
		</view>
		
		<view class="p-3">
			<view class="text-light-muted font-md">
				<text class="font-lg text-dark mr-2">小贱</text>
				13396095889
			</view>
			<view class="text-light-muted font-md">
				广东省 深圳市 南山区 xxx街道 明亮科技园 2栋122
			</view>
		</view>
		<divider></divider>
		<view class="px-2">
			<block v-for="(item,index) in order_items" :key="index">
				<order-list-item :goods="item" :index="index"></order-list-item>
			</block>
		</view>
		<divider></divider>
		
		<uni-list-item>
			<text class="font-md text-light-muted">商品总价</text>
			<view slot="right" class="font-md text-light-muted">￥128.00</view>
		</uni-list-item>
		<uni-list-item>
			<text class="font-md text-light-muted">快递</text>
			<view slot="right" class="font-md text-light-muted">免邮</view>
		</uni-list-item>
		<uni-list-item>
			<text class="font-md text-light-muted">优惠券</text>
			<view slot="right" class="font-md text-light-muted">-￥20.00</view>
		</uni-list-item>
		<uni-list-item>
			<text class="font-md main-text-color">实际付款</text>
			<view slot="right" class="font-md main-text-color">
				<price>108.00</price>
			</view>
		</uni-list-item>
		<divider></divider>
		
		<card headTitle="订单信息">
			<uni-list-item title="订单编号" extraWidth="40%">
				<view slot="right" class="font-md text-light-muted">1235346523745</view>
			</uni-list-item>
		</card>
		
		
		<divider></divider>
		<!-- 如果是待支付状态 可以取消订单/去支付 -->
		<!-- 如果是支付失败状态 可以去支付/取消订单 -->
		<template v-if="orderStatus === 1 || orderStatus === 5">
			<view class="w-100 d-flex a-center">
				<view class="flex-1 d-flex a-center j-center py-3 font-md text-white main-bg-color" 
				@tap="openPayMethod"
				hover-class="main-bg-hover-color">去支付</view>
				<view class="flex-1 d-flex a-center j-center py-3 font-md text-white main-bg-color border-left border-light-secondary" 
				@tap="cancelOrder"
				hover-class="main-bg-hover-color">取消订单</view>
			</view>
		</template>
		
		<!-- 如果是待发货状态 可以取消订单 -->
		<template v-if="orderStatus === 2">
			<view class="w-100 d-flex a-center">
				<view class="flex-1 d-flex a-center j-center py-3 font-md text-white main-bg-color" 
				@tap="cancelOrder"
				hover-class="main-bg-hover-color">取消订单</view>
			</view>
		</template>
		
		<!-- 如果是待收货状态 可以取消订单/确认收货 -->
		<template v-if="orderStatus === 3">
			<view class="w-100 d-flex a-center">
				<view class="flex-1 d-flex a-center j-center py-3 font-md text-white main-bg-color" 
				hover-class="main-bg-hover-color">确认收货</view>
				<view class="flex-1 d-flex a-center j-center py-3 font-md text-white main-bg-color border-left border-light-secondary"
				hover-class="main-bg-hover-color">查看物流</view>
				<view class="flex-1 d-flex a-center j-center py-3 font-md text-white main-bg-color border-left border-light-secondary" 
				hover-class="main-bg-hover-color">申请退货退款</view>
			</view>
		</template>
		
		<!-- 如果是待评价状态 可以申请退货/去评价/再买一单 -->
		<template v-if="orderStatus === 4">
			<view class="w-100 d-flex a-center">
				<view class="flex-1 d-flex a-center j-center py-3 font-md text-white main-bg-color" 
				hover-class="main-bg-hover-color">再买一单</view>
				<view class="flex-1 d-flex a-center j-center py-3 font-md text-white main-bg-color border-left border-light-secondary" 
				hover-class="main-bg-hover-color">去评价</view>
				<view class="flex-1 d-flex a-center j-center py-3 font-md text-white main-bg-color border-left border-light-secondary"
				hover-class="main-bg-hover-color">申请售后</view>
			</view>
		</template>
		
		<!-- 如果是已取消状态  可以删除订单/重新下单 -->
		<template v-if="orderStatus === 6">
			<view class="w-100 d-flex a-center">
				<view class="flex-1 d-flex a-center j-center py-3 font-md text-white main-bg-color" 
				hover-class="main-bg-hover-color">重新下单</view>
				<view class="flex-1 d-flex a-center j-center py-3 font-md text-white main-bg-color border-left border-light-secondary" 
				hover-class="main-bg-hover-color">删除订单</view>
			</view>
		</template>
		<!-- 如果是退货退款状态 可以退货退款完成 -->
		<template v-if="orderStatus === 7">
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
	
	export default {
		components: {
			orderListItem,
			uniListItem,
			price,
			card
		},
		data() {
			return {
				order_items: [
					{
						id: 25,
						cover: "/static/images/demo/list/1.jpg",
						title: "小米8",
						pprice: 1999.00,
						attrs: "金色 标配",
						num: 1
					},
					{
						id: 26,
						cover: "/static/images/demo/list/1.jpg",
						title: "小米8",
						pprice: 1999.00,
						attrs: "金色 标配",
						num: 1
					}
				],
				
				// 状态值： 0-未知 1-待支付 2-待发货 3-待收货 4-待评价 5-支付失败 6-已取消 7-退货退款中
				orderStatus: 0,
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
		onLoad: function(e) {
			if (e.status) {
				this.orderStatus = parseInt(e.status)
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
			openPayMethod: function() {
				uni.navigateTo({
					url: "/pages/pay-methods/pay-methods"
				});
			},
			// 取消订单
			cancelOrder: function() {
				
			}
		}
	}
</script>

<style>

</style>

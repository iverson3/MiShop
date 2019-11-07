<template>
	<view class="bg-white" @click.stop="openDetail(item.statusNo)">
		<divider></divider>
		<!-- header -->
		<view class="d-flex a-center p-2 border-bottom border-light-secondary">
			<text class="text-light-muted font-md ">{{ item.create_time }}</text>
			<text class="main-text-color ml-auto font-md">{{ item.status }}</text>
		</view>
		<!-- body -->
		<view class="px-2">
			<block v-for="(goods,i) in item.order_items" :key="i">
				<order-list-item :goods="goods" :index="i"></order-list-item>
			</block>
		</view>
		<!-- footer -->
		<view class="d-flex a-center p-2">
			<text class="text-dark font-md ml-auto">共{{ item.total_num }}件商品，合计：￥{{ item.total_price }}</text>
		</view>
		<view class="d-flex j-end a-center px-2 pb-2">
			
			<!-- 如果是待支付状态 可以取消订单/去支付 -->
			<!-- 如果是支付失败状态 可以去支付/取消订单 -->
			<template v-if="item.statusNo === 1 || item.statusNo === 5">
				<view @click.stop="openPayMethod" class="rounded border border-light-secondary px-2 py-1 text-secondary" hover-class="bg-light-secondary">去支付</view>
				<view @click.stop="cancelOrder" class="rounded border border-light-secondary px-2 py-1 text-secondary ml-2" hover-class="bg-light-secondary">取消订单</view>
			</template>
			
			<!-- 如果是待发货状态 可以取消订单 -->
			<template v-if="item.statusNo === 2">
				<view @click.stop="cancelOrder" class="rounded border border-light-secondary px-2 py-1 text-secondary" hover-class="bg-light-secondary">取消订单</view>
			</template>
			
			<!-- 如果是待收货状态 可以取消订单/确认收货 -->
			<template v-if="item.statusNo === 3">
				<view @click.stop="completeOrder" class="rounded border border-light-secondary px-2 py-1 text-secondary" hover-class="bg-light-secondary">确认收货</view>
				<view @click.stop="openLogistics" class="rounded border border-light-secondary px-2 py-1 text-secondary ml-2" hover-class="bg-light-secondary">查看物流</view>
				<view class="rounded border border-light-secondary px-2 py-1 text-secondary ml-2" hover-class="bg-light-secondary">申请退货退款</view>
			</template>
			
			<!-- 如果是待评价状态 可以申请退货/去评价/再买一单 -->
			<template v-if="item.statusNo === 4">
				<view @click.stop="openAfterSale" class="rounded border border-light-secondary px-2 py-1 text-secondary" hover-class="bg-light-secondary">申请售后</view>
				<view @click.stop="toComment" class="rounded border border-light-secondary px-2 py-1 text-secondary ml-2" hover-class="bg-light-secondary">去评价</view>
				<view class="rounded border border-light-secondary px-2 py-1 text-secondary ml-2" hover-class="bg-light-secondary">再买一单</view>
			</template>
			
			<!-- 如果是已取消状态  可以删除订单/重新下单 -->
			<template v-if="item.statusNo === 6">
				<view class="rounded border border-light-secondary px-2 py-1 text-secondary" hover-class="bg-light-secondary">重新下单</view>
				<view @click.stop="deleteOrder" class="rounded border border-light-secondary px-2 py-1 text-secondary ml-2" hover-class="bg-light-secondary">删除订单</view>
			</template>
			<!-- 如果是退货退款状态 可以退货退款完成 -->
			<template v-if="item.statusNo === 7">
				<view class="rounded border border-light-secondary px-2 py-1 text-secondary" hover-class="bg-light-secondary">退货退款完成</view>
			</template>
			
		</view>
	</view>
</template>

<script>
	import orderListItem from '@/components/order/order-list-item.vue'
	
	export default {
		components: {
			orderListItem
		},
		props: {
			item: Object,
			index: Number
		},
		methods: {
			openDetail: function(status) {
				uni.navigateTo({
					url: "/pages/order-detail/order-detail?status=" + status
				})
			},
			// 查看物流
			openLogistics: function() {
				uni.navigateTo({
					url: "/pages/logistics-detail/logistics-detail"
				})
			},
			// 申请售后
			openAfterSale: function() {
				uni.navigateTo({
					url: "/pages/after-sale/after-sale"
				})
			},
			// 去支付
			openPayMethod: function() {
				uni.navigateTo({
					url: "/pages/pay-methods/pay-methods"
				});
			},
			// 确认收货
			completeOrder: function() {
				
			},
			// 取消订单
			cancelOrder: function() {
				
			},
			// 去评价
			toComment: function() {
				
			},
			// 删除订单
			deleteOrder: function() {
				
			}
			
		}
	}
</script>

<style>
</style>

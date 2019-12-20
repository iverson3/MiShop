<template>
	<view class="bg-white" @click.stop="openDetail(item.id)">
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
			<text class="text-dark font-md ml-auto">共{{ item.order_items | goodsCount }}件商品，合计：￥{{ item.total_price }}</text>
		</view>
		<view class="d-flex j-end a-center px-2 pb-2">
			
			<!-- 如果是待支付状态 可以取消订单/去支付 -->
			<!-- 如果是支付失败状态 可以去支付/取消订单 -->
			<template v-if="item.statusNo === 1 || item.statusNo === 5">
				<view @click.stop="openPayMethod(item)" class="rounded border border-light-secondary px-2 py-1 text-secondary" hover-class="bg-light-secondary">{{ item.statusNo === 1?'去支付':'重新支付'}}</view>
				<view @click.stop="cancelOrder(item)" class="rounded border border-light-secondary px-2 py-1 text-secondary ml-2" hover-class="bg-light-secondary">取消订单</view>
			</template>
			
			<!-- 如果是待发货状态 可以取消订单 -->
			<template v-if="item.statusNo === 2">
				<view @click.stop="cancelOrder(item)" class="rounded border border-light-secondary px-2 py-1 text-secondary" hover-class="bg-light-secondary">取消订单</view>
			</template>
			
			<!-- 如果是待收货状态 可以取消订单/确认收货 -->
			<template v-if="item.statusNo === 3">
				<view @click.stop="completeOrder(item)" class="rounded border border-light-secondary px-2 py-1 text-secondary" hover-class="bg-light-secondary">确认收货</view>
				<view @click.stop="openLogistics(item.id)" class="rounded border border-light-secondary px-2 py-1 text-secondary ml-2" hover-class="bg-light-secondary">查看物流</view>
				<view class="rounded border border-light-secondary px-2 py-1 text-secondary ml-2" hover-class="bg-light-secondary">申请退货退款</view>
			</template>
			
			<!-- 如果是待评价状态 可以申请退货/去评价/再买一单 -->
			<template v-if="item.statusNo === 4">
				<view @click.stop="openAfterSale(item.id)" class="rounded border border-light-secondary px-2 py-1 text-secondary" hover-class="bg-light-secondary">申请售后</view>
				<view @click.stop="toComment(item.id)" class="rounded border border-light-secondary px-2 py-1 text-secondary ml-2" hover-class="bg-light-secondary">去评价</view>
				<view class="rounded border border-light-secondary px-2 py-1 text-secondary ml-2" hover-class="bg-light-secondary">再买一单</view>
			</template>
			
			<!-- 如果是已取消状态  可以删除订单/重新下单 -->
			<template v-if="item.statusNo === 6">
				<view @click.stop="reOrder(item)" class="rounded border border-light-secondary px-2 py-1 text-secondary" hover-class="bg-light-secondary">重新下单</view>
				<view @click.stop="deleteOrder(item.id)" class="rounded border border-light-secondary px-2 py-1 text-secondary ml-2" hover-class="bg-light-secondary">删除订单</view>
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
	import utils from '@/common/lib/utils.js';
	
	import {mapMutations} from 'vuex'
	export default {
		components: {
			orderListItem
		},
		props: {
			item: Object,
			index: Number
		},
		filters: {
			formatTime(value) {
				return utils.gettime(value, true)
			},
			
			goodsCount(order_items) {
				let count = 0
				order_items.forEach((item) => {
					count = count + item.num
				})
				return count
			}
		},
		methods: {
			...mapMutations(['changeOrderStatus', 'deleteOrderById', 'reCreateOrder']),
			
			openDetail: function(id) {
				uni.navigateTo({
					url: "/pages/order-detail/order-detail?orderid=" + id
				})
			},
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
			openPayMethod: function(item) {
				// 处于支付失败状态的订单 在去支付之前先修改订单状态为"待支付"
				if (item.statusNo === 5) {
					this.changeOrderStatus({
						id: item.id,
						old_status: item.statusNo,
						new_status: 1
					})
				}
				uni.navigateTo({
					url: "/pages/pay-methods/pay-methods?orderid=" + item.id
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
				this.$emit('refreshView')
				uni.showToast({title: '删除成功', icon: 'none'});
			}
			
		}
	}
</script>

<style>
</style>

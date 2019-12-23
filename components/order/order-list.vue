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
				<common-button @click="openPayMethod">{{ item.statusNo === 1?'去支付':'重新支付'}}</common-button>
				<common-button @click="cancelOrder">取消订单</common-button>
			</template>
			
			<!-- 如果是待发货状态 可以取消订单 -->
			<template v-else-if="item.statusNo === 2">
				<common-button>提醒发货</common-button>
				<common-button @click="applyRefund">申请退款</common-button>
				<!-- <common-button @click="cancelOrder">取消订单</common-button> -->
			</template>
			
			<!-- 如果是待收货状态 可以取消订单/确认收货 -->
			<template v-else-if="item.statusNo === 3">
				<common-button @click="completeOrder">确认收货</common-button>
				<common-button @click="openLogistics">查看物流</common-button>
			</template>
			
			
			
			
			<!-- 如果是待评价状态 可以申请退货/去评价/再买一单 -->
			<template v-else-if="item.statusNo === 4">
				<common-button @click="openAfterSale">申请售后</common-button>
				<common-button @click="toComment">去评价</common-button>
				<!-- <common-button>再买一单</common-button> -->
			</template>
			
			<!-- 如果是已取消状态  可以删除订单/重新下单 -->
			<template v-else-if="item.statusNo === 6">
				<common-button @click="reOrder">重新下单</common-button>
				<common-button @click="deleteOrder">删除订单</common-button>
			</template>
			<!-- 如果是退货退款状态 可以退货退款完成 -->
			<template v-else-if="item.statusNo === 7">
				<common-button>退货退款完成</common-button>
			</template>
			
			<template v-else>
				<common-button @click="openDetail">查看详情</common-button>
			</template>
			
		</view>
	</view>
</template>

<script>
	import orderListItem from '@/components/order/order-list-item.vue'
	import commonButton from '@/components/common/common-button.vue';
	import utils from '@/common/lib/utils.js';
	
	import {mapMutations} from 'vuex'
	export default {
		components: {
			orderListItem,
			commonButton
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
			
			// 申请退款
			applyRefund: function() {
				uni.navigateTo({
					url: '/pages/order-refund/order-refund?orderid=' + this.item.id
				});
			},
			// 去支付
			openPayMethod: function() {
				// 处于支付失败状态的订单 在去支付之前先修改订单状态为"待支付"
				// if (item.statusNo === 5) {
				// 	this.changeOrderStatus({
				// 		id: item.id,
				// 		old_status: item.statusNo,
				// 		new_status: 1
				// 	})
				// }
				uni.navigateTo({
					url: "/pages/pay-methods/pay-methods?orderid=" + this.item.id + "&price=" + this.item.total_price
				});
			},
			openDetail: function() {
				uni.navigateTo({
					url: "/pages/order-detail/order-detail?orderid=" + this.item.id
				})
			},
			// 查看物流
			openLogistics: function() {
				uni.navigateTo({
					url: "/pages/logistics-detail/logistics-detail?orderid=" + this.item.id
				})
			},
			// 取消订单
			cancelOrder: function() {
				uni.showModal({
					content: '确定要取消该订单么？',
					success: (res) => {
						if (res.confirm) {
							uni.showLoading({title: '取消订单中...', mask: true});
							this.$api.post('/closeorder/'+ this.item.id, {}, {token: true, toast: false}).then(res => {
								uni.hideLoading()
								uni.showToast({title: '取消订单成功', icon: 'none'});
								this.$emit('refreshView')
							}).catch(err => {
								uni.hideLoading()
								uni.showToast({title: '取消订单失败', icon: 'none'});
							})
						}
					}
				});
				// this.changeOrderStatus({
				// 	id: item.id,
				// 	old_status: item.statusNo,
				// 	new_status: 6
				// })
			},
			// 确认收货
			completeOrder: function() {
				uni.showModal({
					content: '是否要确认收货?',
					success: res => {
						if (res.confirm) {
							uni.showLoading({title: "确认收货中...", mask: true})
							
							this.$api.post('/order/'+this.item.id+'/received', {}, {token: true, toast: false}).then(res => {
								uni.hideLoading()
								uni.showToast({title: '确认收货成功', icon: 'success'});
								this.$emit('refreshView')
							}).catch(err => {
								uni.hideLoading()
								uni.showToast({title: '确认收货失败', icon: 'none'});
							})
						}
					}
				});
				// this.changeOrderStatus({
				// 	id: item.id,
				// 	old_status: item.statusNo,
				// 	new_status: 4
				// })
			},
			
			
			// 去评价
			toComment: function() {
				uni.navigateTo({
					url: '/pages/comment/comment?orderid=' + this.item.id
				});
			},
			
			// 删除订单
			deleteOrder: function() {
				// this.deleteOrderById(id)
				this.$emit('refreshView')
				uni.showToast({title: '删除成功', icon: 'none'});
			},
			
			
			
			// 申请售后
			openAfterSale: function(id) {
				uni.navigateTo({
					url: "/pages/after-sale/after-sale?orderid=" + id
				})
			},
			// 重新下单
			reOrder: function(item) {
				// this.reCreateOrder(item)
				// uni.navigateTo({
				// 	url: '/pages/order-confirm/order-confirm'
				// });
			}
			
		}
	}
</script>

<style>
</style>

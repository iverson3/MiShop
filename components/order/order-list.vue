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
			<view @click.stop="openAfterSale" class="rounded border border-light-secondary px-2 py-1 text-secondary" hover-class="bg-light-secondary">申请售后</view>
			<view @click.stop="openLogistics" class="rounded border border-light-secondary px-2 py-1 text-secondary ml-2" hover-class="bg-light-secondary">查看物流</view>
			<view class="rounded border border-light-secondary px-2 py-1 text-secondary ml-2" hover-class="bg-light-secondary">确认收货</view>
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
			openLogistics: function() {
				uni.navigateTo({
					url: "/pages/logistics-detail/logistics-detail"
				})
			},
			openAfterSale: function() {
				uni.navigateTo({
					url: "/pages/after-sale/after-sale"
				})
			},
			
		}
	}
</script>

<style>
</style>

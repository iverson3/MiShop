<template>
	<view class="bg-white">
		<divider></divider>
		<!-- header -->
		<view class="d-flex a-center p-2 border-bottom border-light-secondary">
			<text class="text-light-muted font-md ">{{ item.create_time }}</text>
			<text class="main-text-color ml-auto font-md">{{ item.status }}</text>
		</view>
		<!-- body -->
		<view class="px-2">
			<view v-for="(goods,i) in item.order_items" :key="i" class="d-flex a-center py-2 border-bottom border-light-secondary">
				<image :src="goods.cover" mode="widthFix"
				class="rounded mx-2 flex-shrink"
				style="width: 150upx;height: 150upx;"></image>
				<view class="flex-1">
					<view class="d-flex a-center">
						<text class="font-md text-dark">{{ goods.title }}</text>
						<text class="font-md text-light-muted ml-auto">￥{{ goods.pprice }}</text>
					</view>
					<view class="d-flex a-center">
						<text class="font text-light-muted">{{ goods.attrs }}</text>
						<text class="font text-light-muted ml-auto">x {{ goods.num }}</text>
					</view>
				</view>
			</view>
		</view>
		<!-- footer -->
		<view class="d-flex a-center p-2">
			<text class="text-dark font-md ml-auto">共{{ item.total_num }}件商品，合计：￥{{ item.total_price }}</text>
		</view>
		<view class="d-flex j-end a-center px-2 pb-2">
			<view class="rounded border border-light-secondary px-2 py-1 text-secondary" hover-class="bg-light-secondary">查看物流</view>
			<view class="rounded border border-light-secondary px-2 py-1 text-secondary ml-2" hover-class="bg-light-secondary">确认收货</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			item: Object,
			index: Number
		}
	}
</script>

<style>
</style>

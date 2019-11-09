<template>
	<view @tap.stop="openGoodsDetail(goods.id)" class="d-flex a-center py-2 border-bottom border-light-secondary">
		<image :src="goods.cover" mode="widthFix"
		class="rounded mx-2 flex-shrink"
		style="width: 150upx;height: 150upx;"></image>
		<view class="flex-1">
			<view class="d-flex a-center">
				<text class="font-md text-dark" style="line-height: 1.3;">{{ goods.title }}</text>
				<text class="font-md text-light-muted ml-auto">￥{{ goods.pprice }}</text>
			</view>
			<view class="d-flex a-center">
				<text class="font text-light-muted">{{ goods.attrs }}</text>
				<text class="font text-light-muted ml-auto">x {{ goods.num }}</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			goods: Object,
			index: Number
		},
		methods: {
			openGoodsDetail: function(id) {
				uni.navigateTo({
					url: "/pages/detail/detail?goods_id=" + id
				})
			}
		}
	}
</script>

<style>
</style>

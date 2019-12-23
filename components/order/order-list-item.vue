<template>
	<view @tap.stop="openGoodsDetail(goods.id)" class="d-flex a-center py-2 border-bottom border-light-secondary">
		<image :src="goods.cover" mode="widthFix"
		class="rounded mx-2 flex-shrink"
		style="width: 150upx;height: 150upx;"></image>
		<view class="flex-1">
			<view class="d-flex a-center mb-1">
				<text class="font-md text-dark pr-1" style="line-height: 1.3;height: 76upx;text-overflow: ellipsis;overflow: hidden;">{{ goods.title | subTitle }}</text>
				<text class="font-md text-light-muted ml-auto">￥{{ goods.pprice }}</text>
			</view>
			<view class="d-flex a-center">
				<text class="font text-light-muted">{{ goods.skusText }}</text>
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
		filters: {
			subTitle(value) {
				return value.length > 38 ? (value.substr(0, 36) + '...') : value
			}
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

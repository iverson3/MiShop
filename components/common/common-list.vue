<template>
	<view style="width: 372.5upx;" @tap="openDetail">
		<image :src="item.cover" mode="widthFix" lazy-load></image>
		<view class="p-2 pt-1">
			<view class="font-md">{{ item.title }}</view>
			<text class="d-block font text-light-muted">{{ item.desc }}</text>
			<view class="d-flex my-1">
				<price>{{ item.pprice }}</price>
				<view class="font-sm text-light-muted line-through ml-1 a-self-end line-h">￥{{ item.oprice }}</view>
			</view>
		</view>
	</view>
</template>

<script>
	import price from '@/components/common/price.vue'
	
	export default {
		components: {
			price
		},
		props: {
			item: Object,
			index: Number
		},
		methods: {
			openDetail: function() {
				uni.navigateTo({
					url: "/pages/detail/detail?goods_id=" + this.item.id
				})
			}
		}
	}
</script>

<style>
</style>

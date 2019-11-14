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
				// 获取应用页面栈
				let pages = getCurrentPages()
				// 应用中包含当前公共商品列表组件的tab页面
				let tabs = [
					"pages/index/index",
					"pages/cart/cart"
				]
				
				let url = "/pages/detail/detail?goods_id=" + this.item.id
				// 如果当前页面是tab页或者页面栈中只有当前一个页面 则不允许使用uni.redirectTo()进行页面跳转
				if (pages.length === 1 || tabs.indexOf(pages[pages.length - 1].route) > -1) {
					uni.navigateTo({url: url})
				} else {
					uni.redirectTo({url: url})
				}
			}
		}
	}
</script>

<style>
</style>

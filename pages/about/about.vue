<template>
	<view>
		<view class="d-flex flex-column a-center j-center py-5 my-3">
			<image src="/static/images/demo/demo5.jpg" mode="widthFix" style="width: 160upx;height: 160upx;"></image>
			<view class="text-light-muted font-md mt-1">
				MiShop 1.0.0
			</view>
		</view>
		
		<view class="bg-white">
			<uni-list-item title="版本更新" showArrow></uni-list-item>
			<uni-list-item title="了解小米" showArrow></uni-list-item>
			<uni-list-item title="官方微博" showArrow></uni-list-item>
			<uni-list-item title="廉洁小米" showArrow></uni-list-item>
			<uni-list-item title="APP分享" showArrow></uni-list-item>
			<uni-list-item title="授权直供店" showArrow></uni-list-item>
			<uni-list-item @click="clearCache" title="清除缓存" showArrow></uni-list-item>
		</view>
	</view>
</template>

<script>
	import uniListItem from '@/components/uni-ui/uni-list-item/uni-list-item.vue';
	
	export default {
		components: {
			uniListItem
		},
		data() {
			return {
				
			}
		},
		methods: {
			clearCache: function() {
				uni.removeStorageSync('orderList')
				uni.showToast({
					title: '缓存清除成功',
					icon: 'none'
				});
			}
		}
	}
</script>

<style>
page {
	background-color: #EEEEEE;
}
</style>

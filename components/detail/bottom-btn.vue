<template>
	<view>
		<view style="height: 100upx;"></view>
		<view class="d-flex a-stretch bg-white position-fixed left-0 right-0 bottom-0" style="height: 100upx;z-index: 100;">
			<view class="flex-1 flex-column a-center j-center line-h-md text-center" 
			@tap="addCollect"
			hover-class="bg-light-secondary">
				<view class="iconfont text-muted line-h-md" :class="hasCollect? 'icon-shoucang-has':'icon-shoucang'"></view>
				收藏
			</view>
			<view @tap="toCart" class="flex-1 flex-column a-center j-center line-h-md text-center" hover-class="bg-light-secondary">
				<view class="iconfont icon-gouwuche text-muted line-h-md"></view>
				购物车
			</view>
			<view @tap="$emit('showAttrPopup')" class="d-flex j-center a-center font-md main-bg-color text-white" hover-class="main-bg-hover-color" style="flex: 2.5;">
				加入购物车
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			goods_id: {
				type: Number,
				default: 0
			}
		},
		computed: {
			hasCollect() {
				// 判断当前商品id是否在收藏记录里面
				if (this.goods_id === 0) return false
				let collectList = uni.getStorageSync('collectList')
				if (!collectList) return false
				collectList = JSON.parse(collectList)
				let index = collectList.indexOf(this.goods_id)
				if (index === -1) return false
				return true
			}
		},
		methods: {
			addCollect: function() {
				let collectList = uni.getStorageSync('collectList')
				if (collectList) {
					collectList = JSON.parse(collectList)
				} else {
					collectList = []
				}
				
				// 收藏状态下 则取消收藏
				if (this.hasCollect) {
					let index = collectList.indexOf(this.goods_id)
					collectList.splice(index, 1)
				} else { // 反之 则加入收藏
					collectList.push(this.goods_id)
				}
				uni.setStorageSync('collectList', JSON.stringify(collectList))
			},
			toCart: function() {
				uni.switchTab({
					url: "/pages/cart/cart"
				})
			}
		}
	}
</script>

<style>
</style>

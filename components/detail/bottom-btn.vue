<template>
	<view>
		<view style="height: 100upx;"></view>
		<view class="d-flex a-stretch bg-white position-fixed left-0 right-0 bottom-0" style="height: 100upx;z-index: 100;">
			<view class="flex-1 flex-column a-center line-h-md text-center" 
			@tap="addCollect" style="padding-left: 30upx;"
			hover-class="bg-light-secondary">
				<view class="iconfont text-muted line-h-md" :class="hasCollect? 'icon-shoucang-done':'icon-shoucang'"></view>
				收藏
			</view>
			<view class="flex-1 flex-column a-center line-h-md text-center position-relative" 
			@tap="toCart" style="padding-right: 50upx;"
			hover-class="bg-light-secondary">
				<view class="iconfont icon-gouwuche text-muted line-h-md"></view>
				<view v-if="cartCount > 0 || cartCount === '99+'" class="position-absolute" style="left: 100upx;top: 0;">
					<uni-badge :text="cartCount" type="error" size="small"></uni-badge>
				</view>
				购物车
			</view>
			<view @tap="$emit('showAttrPopup')" class="d-flex j-center a-center font-md main-bg-color text-white" hover-class="main-bg-hover-color" style="flex: 2.5;">
				加入购物车
			</view>
		</view>
	</view>
</template>

<script>
	import uniBadge from '@/components/uni-ui/uni-badge/uni-badge.vue';
	
	import { mapGetters } from 'vuex'
	export default {
		components: {
			uniBadge
		},
		props: {
			goods_id: {
				type: Number,
				default: 0
			},
			hasCollect: {
				type: Boolean,
				default: false
			},
			goodsInfo: Object
		},
		computed: {
			...mapGetters(['cartCount'])
		},
		methods: {
			addCollect: function() {
				if (!this.isLogin()) {
					return uni.showToast({title: '请先登录', icon: 'none'});
				}
				
				let collectList = uni.getStorageSync('collectList')
				collectList = collectList? JSON.parse(collectList) : []				
				let collectDetailList = uni.getStorageSync('collectDetailList')
				collectDetailList = collectDetailList? JSON.parse(collectDetailList) : []
				
				let hasCollect = false
				// 收藏状态下 则取消收藏
				if (this.hasCollect) {
					let index = collectList.indexOf(this.goods_id)
					collectList.splice(index, 1)
					collectDetailList.splice(index, 1)
				} else { // 反之 则加入到收藏夹的最前面
					collectList.unshift(this.goods_id)
					collectDetailList.unshift(this.goodsInfo)
					hasCollect = true
				}
				uni.setStorageSync('collectList', JSON.stringify(collectList))
				uni.setStorageSync('collectDetailList', JSON.stringify(collectDetailList))
				// 触发changeCollect事件 让父组件去更新收藏字段
				this.$emit('changeCollect', hasCollect)
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

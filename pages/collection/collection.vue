<template>
	<view>
		<template v-if="collectList.length > 0">
			<block v-for="(item,index) in collectList" :key="index">
				<uni-swipe-action :options="options" @click="bindClick($event, item)">
					<view @tap="openGoodsDetail(collectDetailList[index].id)" class="d-flex a-center py-2 border-bottom border-light-secondary">
						<image :src="collectDetailList[index].cover" mode="widthFix"
						class="rounded mx-2 flex-shrink"
						style="width: 150upx;height: 150upx;"></image>
						<view class="flex-1">
							<view class="d-flex a-center">
								<text class="font-md text-dark">{{ collectDetailList[index].title }}</text>
								<text class="font-md text-light-muted ml-auto mr-2">￥{{ collectDetailList[index].pprice }}</text>
							</view>
							<view class="d-flex a-center">
								<text class="font text-light-muted">{{ collectDetailList[index].desc }}</text>
							</view>
						</view>
					</view>
				</uni-swipe-action>
			</block>
		</template>
		
		<template v-else>
			<view class="w-100 d-flex j-center a-center" style="padding-top: 150upx;">
				<text class="font-md text-light-muted">收藏夹空空如也</text>
			</view>
		</template>
	</view>
</template>

<script>
	import uniSwipeAction from '@/components/uni-ui/uni-swipe-action/uni-swipe-action.vue'
	
	export default {
		components: {
			uniSwipeAction
		},
		data() {
			return {
				collectList: [],
				collectDetailList: [],
				
				
				options: [{
					text: '删除',
					style: {
						backgroundColor: '#dd524d'
					}
				}],
			}
		},
		onLoad: function() {
			let collectList = uni.getStorageSync('collectList')
			let collectDetailList = uni.getStorageSync('collectDetailList')
			
			if (collectList) {
				this.collectList = JSON.parse(collectList)
				this.collectDetailList = JSON.parse(collectDetailList)
				console.log(this.collectDetailList[0]);
			}
		},
		onNavigationBarButtonTap: function(e) {
			if (e.index === 0) {
				this.clearCollect()
			}
		},
		methods: {
			// 删除收藏
			bindClick(e, goods_id) {
				switch (e.index){
					case 0:  // 删除
						uni.showModal({
							content: "确定要删除吗？",
							success: (res) => {
								if (res.confirm) {
									let index = this.collectList.indexOf(goods_id)
									this.collectList.splice(index, 1)
									this.collectDetailList.splice(index, 1)
									uni.setStorageSync('collectList', JSON.stringify(this.collectList))
									uni.setStorageSync('collectDetailList', JSON.stringify(this.collectDetailList))
									uni.showToast({title: "删除成功"})
								}
							}
						})
						break;
					default:
						break;
				}
			},
			// 清空收藏列表
			clearCollect: function() {
				uni.showModal({
					content: "确定要清空收藏吗？",
					success: (res) => {
						if (res.confirm) {
							this.collectList = []
							uni.removeStorageSync('collectList')
							uni.removeStorageSync('collectDetailList')
							uni.showToast({title: "清空成功"})
						}
					}
				})
			},
			// 进入对应的商品页面
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

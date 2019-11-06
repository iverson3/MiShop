<template>
	<view>
		<block v-for="(item,index) in collectList" :key="index">
			<uni-swipe-action :options="options" @click="bindClick($event, item)">
				<view class="w-100 p-5 d-flex a-center j-center border-bottom border-light-secondary bg-white font-md text-info"
				@tap="openGoodsDetail(item)"
				style="height: 100upx;">
					商品ID: {{ item }}
				</view>
			</uni-swipe-action>
		</block>
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
			if (collectList) {
				this.collectList = JSON.parse(collectList)
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
									uni.setStorageSync('collectList', JSON.stringify(this.collectList))
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
				this.collectList = []
				uni.removeStorageSync('collectList')
				uni.showToast({title: "清空成功"})
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

<template>
	<view>
		<view class="p-2">
			<view class="d-flex a-center py-2 border-bottom border-light-secondary">
				<text class="text-muted">用户评价 ({{ total }})</text>
				<text class="main-text-color ml-auto mr-1">{{ (good_rate * 100) + '%' }}</text>
				<text class="text-muted">满意</text>
			</view>
			
			<view class="d-flex flex-wrap pt-2" style="margin-right: -20upx;">
				<view class="px-2 py border rounded mr-2 mb-2 cate-item" 
				v-for="(item,index) in cateList" 
				:class="cateIndex===index?'active':''"
				@tap="cateChange(index)"
				:key="index">
					{{ item.name }}
				</view>
			</view>
		</view>
		
		<divider></divider>
		
		<!-- 评论列表 -->
		<view v-for="(item,index) in list" :key="index" class="d-flex p-2 a-start border-bottom border-light-secondary">
			<image :src="item.user.avatar" mode="widthFix" class="rounded flex-shrink" style="width: 90upx;height: 90upx;"></image>
			<view class="pl-2 flex-1">
				<view class="d-flex a-center">
					<text class="font-md text-primary font-weight">{{ item.user.nickname }}</text>
					<view class="iconfont icon-service main-text-color ml-auto">
						<text class="pl-1 font">{{ item.rating | ratingTitle }}</text>
					</view>
				</view>
				<view class="line-h-md font-md">
					{{ item.review.data }}
				</view>
				<view class="row" v-if="item.review.image.length > 0">
					<view v-for="(img,imgIndex) in item.review.image" :key="imgIndex" class="span24-8 px pb">
						<image :src="img" mode="widthFix" style="height: 100upx;"></image>
					</view>
				</view>
				<view class="d-flex a-center">
					<text class="text-light-muted">{{ item.review_time | formatTime }}</text>
					<view class="d-flex text-light-muted ml-auto a-center mr-2">
						{{ item.goods_num }} <text class="iconfont icon-dianzan text-muted ml-1"></text>
					</view>
					<view class="d-flex text-light-muted a-center">
						19 <text class="iconfont icon-pinglun text-muted ml-1"></text>
					</view>
				</view>
				<!-- 客服回复 -->
				<view v-for="(item2,index2) in item.extra" :key="index2" class="bg-light-secondary p-2 rounded d-flex flex-wrap a-center mt-1">
					<!-- 判断是否是官方客服回复 还是用户回复 -->
					<template v-if="!item2.isuser">
						<text class="main-text-color">官方回复：</text>
						{{ item2.data }}
						<view class="iconfont icon-dianzan text-light-muted line-h-md font ml-2">
							<text class="text-muted pl-1">赞客服 {{ item2.good_num }}</text>
						</view>
					</template>
				</view>
			</view>
		</view>
		
		<!-- 上拉加载更多 -->
		<divider></divider>
		<view class="d-flex a-center j-center text-light-muted font-md py-3">
			{{ loadtext }}
		</view>
		
	</view>
</template>

<script>
	import utils from '@/common/lib/utils.js';
	
	// 三种状态显示的文字
	const PULLLOADMORE = '上拉加载更多'
	const LOADING = '加载中...'
	const NOMORE = '没有更多了'
	
	export default {
		data() {
			return {
				id: 0,
				cateIndex: 0,
				cateList: [
					{ name: "全部", value: "" },
					{ name: "好评", value: "/good" },
					{ name: "中评", value: "/middle" },
					{ name: "差评", value: "/bad" }
				],
				
				total: 0,
				page: 1,
				good_rate: 0,
				list: [],
				
				// 三个状态： 上拉加载更多/加载中.../没有更多了
				loadtext: PULLLOADMORE
			}
		},
		filters: {
			formatTime(value) {
				return utils.gettime(value)
			},
			ratingTitle(val) {
				if (val === 3) {
					return '中评'
				} else if (val > 3) {
					return '好评'
				} else {
					return '差评'
				}
			}
		},
		onLoad: function(e) {
			this.id = e.id;
			this.__init()
		},
		// 监听页面下拉刷新
		onPullDownRefresh: function() {
			this.page = 1
			this.getData((res) => {
				uni.stopPullDownRefresh();
				if (res) {
					uni.showToast({title: '刷新成功', icon: 'none'});
				} else {
					uni.showToast({title: '刷新失败，请重试', icon: 'none'});
				}
			}, true)
		},
		// 到达页面底部
		onReachBottom: function() {
			if (this.loadtext !== PULLLOADMORE) return
			// 加载下一页数据
			this.page++
			this.getData((res) => {
				if (res) {
					uni.showToast({title: '加载成功', icon: 'none'});
				} else {
					uni.showToast({title: '加载失败，请重试', icon: 'none'});
				}
			})
		},
		methods: {
			 __init() {
				this.getData()
			},
			async getData(callback = false, refresh = false) {
				if (!refresh) this.loadtext = LOADING
				
				let type = this.cateList[this.cateIndex].value
				let res = await this.$api.get(`/goods/${this.id}/comments${type}?page=${this.page}`)
				if (res) {
					this.total = res.total
					this.good_rate = res.good_rate
					if (refresh) {
						this.list = res.list
					} else {
						this.list = [...this.list, ...res.list]
					}
					
					if (typeof callback === 'function') callback(true)
					this.loadtext = res.list.length < 10 ? NOMORE : PULLLOADMORE
				} else {
					// 在请求数据失败的情况下 要根据条件还原相应的数据
					this.loadtext = PULLLOADMORE
					// 如果是首次加载数据失败 则不需要还原page参数
					// 如果是加载更多数据失败 则需要还原page参数 
					if (this.page > 1) {
						this.page = this.page - 1
					}
					if (typeof callback === 'function') callback(false)
				}
			},
			
			cateChange: function(index) {
				this.cateIndex = index
				this.page = 1
				
				uni.showLoading({
					title: "加载中..."
				})
				this.getData((res) => {
					uni.hideLoading()
					if (res) {
						uni.showToast({title: '加载成功', icon: 'none'});
					} else {
						uni.showToast({title: '加载失败，请重试', icon: 'none'});
					}
				}, true)
			}
		}
	}
</script>

<style>
.cate-item {
	background: #FFEBEC;
	color: #7B6D6C;
	border-color: #F4E0E1;
}
.cate-item.active {
	background: #FF6B01!important;
	color: #FFFFFF!important;
	border-color: #DE7232!important;
}
</style>

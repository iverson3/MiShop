<template>
	<view class="d-flex flex-column" style="height: 100%;">
		<!-- 选项卡 -->
		<view class="d-flex a-center bg-white font-md text-muted border-top border-bottom border-light-secondary position-fixed top-0 left-0 right-0" style="height: 90upx;z-index: 100;">
			<view v-for="(item,index) in tabBars" :key="index" 
			@tap="changeTab(index)"
			:class="index === tabIndex? 'tabactive':''"
			class="flex-1 d-flex j-center a-center py-2">
				{{ item.name }}
			</view>
		</view>
		<!-- 占位 -->
		<view class="w-100" style="height: 90upx;display: inline-table;"></view>
		
		<scroll-view scroll-y class="flex-1" style="background-color: #F5F5F5;">
			<!-- 订单列表 -->
			<block v-for="(tab,tabI) in tabBars" :key="tabI">
				<view class="position-relative" v-show="tabI === tabIndex" style="min-height: 400upx;">
					<template v-if="tab.list.length > 0">
						<!-- 列表 -->
						<block v-for="(item,index) in tab.list" :key="index">
							<order-list :item="item" :index="index" @refreshView="refetchOrderData"></order-list>
						</block>
						<divider></divider>
					</template>
					
					<template v-else-if="tab.refetch">
						<!-- 获取数据失败，可以再次尝试获取 -->
						<view class="w-100 d-flex j-center a-center" @tap="refetchOrderData" style="height: 400upx;">
							<text class="font-md text-light-muted">点击再次请求数据</text>
						</view>
					</template>
					
					<template v-else>
						<!-- 没有订单 -->
						<no-thing :icon="tab.no_thing" :msg="tab.msg"></no-thing>
					</template>
				</view>
			</block>
			
			
			<!-- 热门商品推荐列表 -->
			<view class="text-center main-text-color font-md font-weight pt-5 bg-white">为你推荐</view>
			<view class="position-relative d-flex j-center a-center text-secondary pb-5 pt-3 bg-white">
				<view class="px-2 position-absolute" style="background: white;z-index: 2;">买的人还买了</view>
				<view class="position-absolute" style="background: #DDDDDD;height: 1upx;left: 0;right: 0;"></view>
			</view>
			<!-- 列表 -->
			<view class="row j-sb bg-white">
				<common-list v-for="(item,index) in hotList" :key="index" :item="item" :index="index"></common-list>
			</view>
		</scroll-view>
		
	</view>
</template>

<script>
	import commonList from '@/components/common/common-list.vue'
	import noThing from '@/components/common/no-thing.vue'
	import orderList from '@/components/order/order-list.vue'
	
	import {mapState} from 'vuex'
	export default {
		components: {
			commonList,
			noThing,
			orderList
		},
		data() {
			return {
				tabIndex: 0,
				
				// 订单类型，可选项：paying(待支付)，receiving(待收货)，reviewing(待评论)，all(全部订单)
				tabBars: [
					{
						name:"全部",
						orderStatus: 0,
						type: "all",
						no_thing: "no_comment",
						msg: "您还没有任何订单",
						list: [],
						refetch: false
					},
					{
						name:"待付款",
						orderStatus: 1,
						type: "paying",
						no_thing: "no_pay",
						msg: "您还没有待付款订单",
						list: [],
						refetch: false
					},
					{
						name:"待发货",
						orderStatus: 2,
						type: "",
						no_thing: "no_receiving",
						msg: "您还没有待发货订单",
						list: [],
						refetch: false
					},
					{
						name:"待收货",
						orderStatus: 3,
						type: "receiving",
						no_thing: "no_receiving",
						msg: "您还没有待收货订单",
						list: [],
						refetch: false
					},
					{
						name:"待评价",
						orderStatus: 4,
						type: "reviewing",
						no_thing: "no_comment",
						msg: "您还没有待评价订单",
						list: [],
						refetch: false
					}
				],
				
				hotList: []
			}
		},
		computed: {
			...mapState({
				statusList: state => state.order.statusList
			})
		},
		onNavigationBarButtonTap: function(e) {
			if (e.index === 0) {
				uni.switchTab({
					url: '/pages/cart/cart'
				})
			} else {
				uni.navigateTo({
					url: '/pages/search/search',
				});
			}
		},
		onLoad: function(e) {
			if (e.tab) {
				this.tabIndex = parseInt(e.tab)
			}
			this.getOrderData(this.tabIndex)
			this.getHotList()
		},
		onShow: function() {
			this.refetchOrderData()
		},
		methods: {
			// 获取热门商品列表数据
			getHotList: function() {
				this.$api.get('/goods/hotlist').then(res => {
					this.hotList = res.map(v => {
						return {
							id: v.id,
							cover: v.cover,
							title: v.title,
							desc: v.desc,
							oprice: v.min_oprice,
							pprice: v.min_price
						}
					})
				})
			},
			
			changeTab: function(index) {
				this.tabIndex = index
				// 切换tab时 页面回到顶部
				uni.pageScrollTo({
					scrollTop: 0,
					duration: 100
				})
				this.getOrderData(index)
			},
			refetchOrderData: function() {
				this.getOrderData(this.tabIndex)
			},
			getOrderData: function(index) {
				if (this.tabBars[index].type === '') return
				uni.showLoading({title: "加载中...", mask: true})
				
				this.$api.post('/order/' + this.tabBars[index].type, {}, {token: true, toast: false}).then(res => {
					console.log(res.length);
					uni.hideLoading()
					this.tabBars[index].list = res.map(item => {
						let total_num = 0
						let order_items = item.order_items.map(v => {
							let attrs = []
							if (v.skus_type === 1 && v.goods_skus && v.goods_skus.skus) {
								let skus = v.goods_skus.skus
								for (let k in skus) {
									attrs.push(skus[k].value)
								}
							}
							total_num = total_num + v.num
							return {
								id: v.goods_id,
								cover: v.goods_item.cover,
								title: v.goods_item.title,
								pprice: v.price,
								skusText: attrs.join(','),
								num: v.num
							}
						})
						let status = this.$help.formatOrderStatus(item)
						let statusObj = this.statusList.find(obj => obj.status === status)
						return {
							id: item.id,
							create_time: item.create_time,
							statusNo: statusObj.statusNo,
							status: statusObj.status,
							order_items: order_items,
							total_num: total_num,
							total_price: item.total_price
						}
					})
					this.tabBars[index].refetch = false
					
				}).catch(err => {
					console.log(err);
					uni.hideLoading()
					this.tabBars[index].list = []
					this.tabBars[index].refetch = true
					uni.showToast({title: '获取数据失败', icon: 'none'});
				})
			}
		}
	}
</script>

<style>
.tabactive {
	border-bottom: 5upx solid #FD6801;
	color: #FD6801;
	margin-bottom: -5upx;
}
</style>

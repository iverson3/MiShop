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
	
	import {mapState, mapGetters, mapMutations, mapActions} from 'vuex'
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
				
				hotList: [
					{
						id: 25,
						cover:"/static/images/demo/list/1.jpg",
						title:"米家空调",
						desc:"1.5匹变频",
						oprice:2699,
						pprice:1399
					},
					{
						id: 25,
						cover:"/static/images/demo/list/1.jpg",
						title:"米家空调",
						desc:"1.5匹变频",
						oprice:2699,
						pprice:1399
					},
					{
						id: 25,
						cover:"/static/images/demo/list/1.jpg",
						title:"米家空调",
						desc:"1.5匹变频",
						oprice:2699,
						pprice:1399
					},
					{
						id: 25,
						cover:"/static/images/demo/list/1.jpg",
						title:"米家空调",
						desc:"1.5匹变频",
						oprice:2699,
						pprice:1399
					},
					{
						id: 25,
						cover:"/static/images/demo/list/1.jpg",
						title:"米家空调",
						desc:"1.5匹变频",
						oprice:2699,
						pprice:1399
					},
					{
						id: 25,
						cover:"/static/images/demo/list/1.jpg",
						title:"米家空调",
						desc:"1.5匹变频",
						oprice:2699,
						pprice:1399
					}
				]
			}
		},
		computed: {
			...mapState({
				list: state => state.order.list,
			}),
			...mapGetters(['getOrderListByStatus'])
		},
		watch: {
			async tabIndex(newValue, oldValue) {
				// console.log(newValue)
			}
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
			this.__init()
		},
		onShow: function() {
			// this.__init()
		},
		methods: {
			...mapMutations(['setOrderList']),
			
			async __init() {
				this.getOrderData(this.tabIndex)
				return
				
				this.tabBars[0].list = this.list
				for (let k in this.tabBars) {
					// 索引变量 k 的类型是 string
					let key = parseInt(k)
					if (key !== 0) {
						this.tabBars[key].list = this.getOrderListByStatus(key)
					}
				}
			},
			
			changeTab: function(index) {
				this.tabIndex = index
				// this.__init()
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
				this.$api.post('/order/' + this.tabBars[index].type, {}, {token: true, toast: false}).then(res => {

					console.log(res.length);
					res.forEach(obj => {
						if (obj.paid_time) {
							if (obj.ship_status === 'pending') {
								obj.statusNo = 3
								obj.status = "待收货"
							} else if (obj.ship_status === 'received') {
								obj.statusNo = 4
								obj.status = "待评价"
							}
							
							if (obj.refund_status === 'pending') {
								// 退款处理中
							} else if (obj.refund_status === 'success') {
								// 退款完成
							}
							
						} else {
							obj.statusNo = 1
							obj.status = "待支付"
						}
					})
					
					if (index === 0) {
						this.setOrderList(res)
					}
					
					this.tabBars[index].list = res
					this.tabBars[index].refetch = false
					
				}).catch(err => {
					console.log(err);
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

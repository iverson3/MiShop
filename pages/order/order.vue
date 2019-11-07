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
							<order-list :item="item" :index="index"></order-list>
						</block>
						<divider></divider>
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
	
	export default {
		components: {
			commonList,
			noThing,
			orderList
		},
		data() {
			return {
				tabIndex: 0,
				tabBars: [
					{
						name:"全部",
						no_thing: "no_comment",
						msg: "您还没有任何订单",
						list: [
							{
								create_time: "2019-08-12",
								status: "已发货",
								statusNo: 3,
								order_items: [
									{
										id: 25,
										cover: "/static/images/demo/list/1.jpg",
										title: "小米8",
										pprice: 1999.00,
										attrs: "金色 标配",
										num: 1
									},
									{
										id: 25,
										cover: "/static/images/demo/list/2.jpg",
										title: "小米8",
										pprice: 1999.00,
										attrs: "金色 标配",
										num: 1
									}
								],
								total_num: 2,
								total_price: 6999.00
							},
							{
								create_time: "2019-08-12",
								status: "待发货",
								statusNo: 2,
								order_items: [
									{
										id: 25,
										cover: "/static/images/demo/list/3.jpg",
										title: "小米8",
										pprice: 1999.00,
										attrs: "金色 标配",
										num: 1
									}
								],
								total_num: 1,
								total_price: 1999.00
							},
							{
								create_time: "2019-08-12",
								status: "待评价",
								statusNo: 4,
								order_items: [
									{
										id: 25,
										cover: "/static/images/demo/list/3.jpg",
										title: "小米8",
										pprice: 1999.00,
										attrs: "金色 标配",
										num: 1
									}
								],
								total_num: 1,
								total_price: 1999.00
							}
						]
					},
					{
						name:"待付款",
						no_thing: "no_pay",
						msg: "您还没有待付款订单",
						list: []
					},
					{
						name:"待发货",
						no_thing: "no_receiving",
						msg: "您还没有待发货订单",
						list: [
							{
								create_time: "2019-08-12",
								status: "待发货",
								statusNo: 2,
								order_items: [
									{
										id: 25,
										cover: "/static/images/demo/list/5.jpg",
										title: "小米8",
										pprice: 1999.00,
										attrs: "金色 标配",
										num: 1
									}
								],
								total_num: 1,
								total_price: 1999.00
							}
						]
					},
					{
						name:"待收货",
						no_thing: "no_receiving",
						msg: "您还没有待收货订单",
						list: [
							{
								create_time: "2019-08-12",
								status: "已发货",
								statusNo: 3,
								order_items: [
									{
										id: 25,
										cover: "/static/images/demo/list/1.jpg",
										title: "小米8",
										pprice: 1999.00,
										attrs: "金色 标配",
										num: 1
									},
									{
										id: 25,
										cover: "/static/images/demo/list/2.jpg",
										title: "小米8",
										pprice: 1999.00,
										attrs: "金色 标配",
										num: 1
									}
								],
								total_num: 2,
								total_price: 6999.00
							}
						]
					},
					{
						name:"待评价",
						no_thing: "no_comment",
						msg: "您还没有待评价订单",
						list: [
							{
								create_time: "2019-08-12",
								status: "待评价",
								statusNo: 4,
								order_items: [
									{
										id: 25,
										cover: "/static/images/demo/list/6.jpg",
										title: "小米8",
										pprice: 1999.00,
										attrs: "金色 标配",
										num: 1
									}
								],
								total_num: 1,
								total_price: 1999.00
							}
						]
					}
				],
				
				hotList: [
					{
						cover:"/static/images/demo/list/1.jpg",
						title:"米家空调",
						desc:"1.5匹变频",
						oprice:2699,
						pprice:1399
					},
					{
						cover:"/static/images/demo/list/1.jpg",
						title:"米家空调",
						desc:"1.5匹变频",
						oprice:2699,
						pprice:1399
					},
					{
						cover:"/static/images/demo/list/1.jpg",
						title:"米家空调",
						desc:"1.5匹变频",
						oprice:2699,
						pprice:1399
					},
					{
						cover:"/static/images/demo/list/1.jpg",
						title:"米家空调",
						desc:"1.5匹变频",
						oprice:2699,
						pprice:1399
					},
					{
						cover:"/static/images/demo/list/1.jpg",
						title:"米家空调",
						desc:"1.5匹变频",
						oprice:2699,
						pprice:1399
					},
					{
						cover:"/static/images/demo/list/1.jpg",
						title:"米家空调",
						desc:"1.5匹变频",
						oprice:2699,
						pprice:1399
					}
				]
			}
		},
		watch: {
			async tabIndex(newValue, oldValue) {
				console.log(newValue)
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
		},
		methods: {
			changeTab: function(index) {
				this.tabIndex = index
				// 切换tab时 页面回到顶部
				uni.pageScrollTo({
					scrollTop: 0,
					duration: 100
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

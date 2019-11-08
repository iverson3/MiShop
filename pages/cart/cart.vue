<template>
	<view class="animated fadeIn faster" style="background: #F5F5F5;">
		
		<loading-plus v-if="beforeReady"></loading-plus>
		
		<!-- 自定义的顶部导航栏 -->
		<!-- 在微信小程序平台不需要状态栏statusBar -->
		<!-- #ifdef MP-WEIXIN -->
		<uni-nav-bar :right-text="isedit?'完成':'编辑'"
		@click-right="changeEditStatus"
		title="购物车" 
		:statusBar="false" 
		:fixed="true"
		:shadow="false"></uni-nav-bar>
		<!-- #endif -->
		<!-- #ifndef MP-WEIXIN -->
		<uni-nav-bar :right-text="isedit?'完成':'编辑'"
		@click-right="changeEditStatus"
		title="购物车" 
		:statusBar="true" 
		:fixed="true"
		:shadow="false"></uni-nav-bar>
		<!-- #endif -->
		
		
		<!-- 购物车为空 -->
		<view v-if="disableSelectAll" class="py-5 d-flex j-center a-center bg-white border">
			<view class="iconfont icon-gouwuche text-light-muted" style="font-size: 50upx;"></view>
			<view class="text-light-muted mx-2">购物车空空如也</view>
			<view class="px-2 py-1 border border-light-secondary rounded" hover-class="bg-light-secondary" @tap="gotoIndex">去逛逛</view>
		</view>
		
		<!-- 购物车商品列表组件 -->
		<view v-else class="bg-white px-2">
			<!-- 列表 -->
			<template v-for="(item,index) in list">
				<view :key="index" class="d-flex a-center py-1 border-bottom border-light-secondary" style="height: 260upx;">
					
					<label @click="selectItem(index)" class="radio d-flex a-center j-center flex-shrink" style="width: 80upx;height: 80upx;">
						<radio :value="item.id" :checked="item.checked" color="#FD6801"/>
					</label>
					
					<image :src="item.cover" mode="widthFix" 
					@tap="openGoodsDetail(item.id)"
					class="border border-light-secondary rounded p-2 flex-shrink"
					style="width: 150upx;height: 150upx;"></image>
					
					<view class="d-flex flex-column flex-1">
						<view class="flex-1 d-flex flex-column pl-2">
							<view @tap="openGoodsDetail(item.id)" class="text-dark" style="font-size: 35upx;">
								{{ item.title }}
							</view>
							<!-- 商品的属性和规格 -->
							<view @tap.stop="doShowPopup(index)" class="d-flex text-light-muted mb-1 p-1 pl-0" :class="isedit? 'bg-light-secondary':''">
								<text class="mr-1" v-for="(attr,i) in item.attrs" :key="i">{{ attr.list[attr.selected].name }}</text>
								<view v-if="isedit" class="iconfont icon-bottom font ml-auto"></view>
							</view>
						</view>
						
						<view class="mt-auto d-flex j-sb pl-2">
							<price>{{ item.pprice }}</price>
							<view class="a-self-end">
								<uni-number-box @change="changeNum($event, item)" :value="item.num" :min="item.minnum" :max="item.maxnum"></uni-number-box>
							</view>
						</view>
					</view>
				</view>
				
				<divider :key="index"></divider>
			</template>
		</view>
		
		
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
		
		<!-- 占位 -->
		<view style="height: 100upx;background: white;"></view>
		<!-- 价格合计组件 -->
		<view class="d-flex a-center a-stretch position-fixed left-0 right-0 bottom-0 border-top border-light-secondary bg-white" style="height: 100upx;z-index: 1000;">
			<label @click="doSelectAll" class="radio d-flex a-center j-center flex-shrink" style="width: 120upx;">
				<radio color="#FD6801" :checked="checkedAll" :disabled="disableSelectAll"/>
			</label>
			<!-- 非编辑状态下显示 -->
			<template v-if="!isedit">
				<view class="flex-1 d-flex a-center j-center font-md">
					合计 <price>{{ totalPrice }}</price>
				</view>
				<view @tap="orderConfirm" class="flex-1 d-flex a-center j-center main-bg-color text-white font-md" hover-class="main-bg-hover-color">
					结算
				</view>
			</template>
			<!-- 编辑状态下显示 -->
			<template v-else>
				<view class="flex-1 d-flex a-center j-center font-md main-bg-color text-white">
					移入收藏
				</view>
				<view @tap="doDelGoods(true)"
				class="flex-1 d-flex a-center j-center bg-danger text-white font-md" 
				hover-class="main-bg-hover-color">
					删除
				</view>
			</template>
		</view>
		
		
		<!-- 属性筛选弹出框 -->
		<common-popup :popupClass="popupShow" @hide="doHidePopup">
			<!-- 
			商品信息 h275
			图片 180*180
			 -->
			<view class="d-flex a-center" style="height: 275upx;">
				<image src="../../static/images/demo/list/1.jpg" 
				style="width: 180upx;height: 180upx;"
				class="border rounded"
				mode="widthFix"></image>
				<view class="pl-2">
				 	<price priceSize="font-lg" unitSize="font">2365</price>
					<view class="d-block">
						<text class="mr-1" v-for="(attr,i) in popupData.attrs" :key="i">{{ attr.list[attr.selected].name }}</text>
					</view>
				</view>
			</view>
			 
			<!-- 表单部分 h660 -->
			<scroll-view scroll-y class="w-100" style="height: 660upx;">
			 	<card :headTitle="item.title" 
				v-for="(item,index) in popupData.attrs"
				:key="index"
				:headTitleWeight="false" 
				:headBorderBottom="false">
					<mi-radio-group :label="item" :selected.sync="item.selected"></mi-radio-group>
				</card>
				<view class="d-flex j-sb a-center p-2 border-top border-light-secondary">
					<text>购买数量</text>
					<uni-number-box :value="popupData.num" :min="popupData.minnum" :max="popupData.maxnum" @change="changeNum($event, popupData)"></uni-number-box>
				</view>
			</scroll-view>
			 
			<!-- 按钮 h100 -->
			<view class="main-bg-color text-white font-md d-flex j-center a-center"
			hover-class="main-bg-hover-color"
			@tap.stop="doHidePopup"
			style="height: 100upx;margin-left: -30upx;margin-right: -30upx;">
				确定
			</view>
		</common-popup>
		
	</view>
</template>

<script>
	import loading from '@/common/mixin/loading.js';
	
	import uniNavBar from '@/components/uni-ui/uni-nav-bar/uni-nav-bar.vue'
	import price from '@/components/common/price.vue'
	import uniNumberBox from '@/components/uni-ui/uni-number-box/uni-number-box.vue'
	import card from '@/components/common/card.vue'
	import commonPopup from '@/components/common/common-popup.vue'
	import miRadioGroup from '@/components/common/mi-radio-group.vue'
	import commonList from '@/components/common/common-list.vue'
	
	import {mapState, mapGetters, mapMutations, mapActions} from 'vuex'
	export default {
		mixins: [loading],
		components: {
			uniNavBar,
			price,
			uniNumberBox,
			card,
			commonPopup,
			miRadioGroup,
			commonList
		},
		data() {
			return {
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
		computed: {
			...mapState({
				isedit: state => state.cart.isedit,
				list: state => state.cart.list,
				popupShow: state => state.cart.popupShow,
			}),
			...mapGetters([
				'checkedAll',
				'someChecked',
				'totalPrice',
				'disableSelectAll',
				'popupData',
				'selectedInfoList',
				
				'defaultPath',
			])
		},
		methods: {
			...mapMutations([
				'selectItem',
				'changeEditStatus',
				'addTempOrder'
			]),
			...mapActions([
				'doSelectAll',
				'doDelGoods',
				'doShowPopup',
				'doHidePopup'
			]),
			
			changeNum: function(e, item) {
				item.num = e
			},
			gotoIndex: function() {
				uni.switchTab({
					url: "/pages/index/index"
				})
			},
			openGoodsDetail: function(id) {
				uni.navigateTo({
					url: "/pages/detail/detail?goods_id=" + id
				})
			},
			
			orderConfirm: function() {
				// 判断是否有选中商品
				if (!this.someChecked) {
					return uni.showToast({title: '请先选择商品', icon: 'none'});
				}
				// 初始化临时订单的字段
				let data = {
					id: 0,
					orderNo: '',   
					create_time: 0,
					status: "临时订单",
					statusNo: 0,
					order_items: [],
					total_num: 1, 
					total_price: 0, 
					pay_price: 0,
					freight: 0,  
					coupon_id: 0, 
					path_id: 0
				}
				// 处理商品信息中的字段
				this.selectedInfoList.forEach(goods => {
					// 删除订单中不需要的商品字段
					delete goods.checked
					delete goods.minnum
					delete goods.maxnum
					// 处理商品属性字段
					let attrs = ""
					goods.attrs.forEach(v => {
						attrs = (attrs === "")? v.list[v.selected].name : (attrs + " " + v.list[v.selected].name)
					})
					goods.attrs = attrs
				})
				
				data.order_items = this.selectedInfoList
				
				console.log(data.order_items[0]);
				// 计算总的商品数
				let sum = 0
				data.order_items.forEach(v => {
					console.log(v.num);
					sum = sum + v.num
				})
				console.log(data.order_items[0]);
				data.total_num = sum
				data.total_price = this.totalPrice
				// 判断是否有默认收货地址
				if (this.defaultPath.length > 0) {
					data.path_id = this.defaultPath[0].id
				} else {
					data.path_id = 0
				}
				// 添加临时订单
				this.addTempOrder(data)
				
				uni.navigateTo({
					url: "/pages/order-confirm/order-confirm"
				})
			}
		}
	}
</script>

<style>

</style>

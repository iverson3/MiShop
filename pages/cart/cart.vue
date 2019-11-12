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
				<view :key="index" class="d-flex a-start py-2 border-bottom border-light-secondary" style="min-height: 200upx;height: auto;">
					
					<label @click="selectItem(index)" class="radio d-flex a-center j-center flex-shrink mt-4" style="width: 80upx;height: 80upx;">
						<radio :value="item.id" :checked="item.checked" color="#FD6801"/>
					</label> 
					
					<image :src="item.cover" mode="widthFix" 
					@tap="openGoodsDetail(item.id)"
					class="border border-light-secondary rounded p-1 flex-shrink"
					style="width: 150upx;height: 150upx;"></image>
					
					<view class="d-flex flex-column flex-1">
						<view class="flex-1 d-flex flex-column pl-2">
							<view @tap="openGoodsDetail(item.id)" class="text-dark" :class="item.sku_type === 1?'mb-1':'mb-5 mt-2'" style="font-size: 32upx;line-height: 1.3;">
								{{ item.title }}
							</view>
							<!-- 商品的属性和规格 -->
							<view v-if="item.sku_type === 1" @tap.stop="doShowPopup(index)" class="d-flex a-center text-light-muted mb-2 px-1 py-0 bg-light-secondary" style="width: auto;border-radius: 20upx;display: inline-table;">
								<text class="line-h mr-2 font-sm">
									{{ item.attrs | getAttrsStr }}
								</text>
								<text class="iconfont icon-bottom line-h font-sm"></text>
							</view>
						</view>
						
						<view class="mt-auto d-flex j-sb pl-2">
							<price>{{ item.pprice }}</price>
							<view class="a-self-end">
								<uni-number-box v-if="updateNum" @forceUpdate="forceRefreshNumber()" @change="changeNum($event, item, index)" :value="item.num" :min="item.minnum" :max="item.maxnum"></uni-number-box>
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
				<view @tap="moveToCollection" class="flex-1 d-flex a-center j-center font-md main-bg-color text-white">
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
				 	<price priceSize="font-lg" unitSize="font">{{ showPrice }}</price>
					<view class="d-block">
						<text class="mr-1">{{ checkedSkus }}</text>
					</view>
				</view>
			</view>
			 
			<!-- 表单部分 h660 -->
			<scroll-view scroll-y class="w-100" style="height: 660upx;">
			 	<card :headTitle="item.title" 
				v-for="(item,index) in attrsDataList"
				:key="index"
				:headTitleWeight="false" 
				:headBorderBottom="false">
					<mi-radio-group :label="item" :selected.sync="item.selected"></mi-radio-group>
				</card>
				<view class="d-flex j-sb a-center px-2 py-3 mt-2 border-top border-light-secondary">
					<text>购买数量</text>
					<uni-number-box v-if="updateNum" @forceUpdate="forceRefreshNumber()" @change="changeNum($event, popupData_local, popupIndex)" :value="popupData_local.num" :min="popupData_local.minnum" :max="maxStock"></uni-number-box>
				</view>
			</scroll-view>
			 
			<!-- 按钮 h100 -->
			<view class="main-bg-color text-white font-md d-flex j-center a-center"
			hover-class="main-bg-hover-color"
			@tap.stop="changeAttr"
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
				attrsDataList: [],
				popupData_local: {},
				updateNum: true,
				
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
				isedit: state => state.cart.isedit,
				popupIndex: state => state.cart.popupIndex,
				list: state => state.cart.list,
				attrsData: state => state.cart.attrsData,
				popupShow: state => state.cart.popupShow,
				
				loginStatus: state => state.user.loginStatus,
			}),
			...mapGetters([
				'checkedAll',
				'someChecked',
				'totalPrice',
				'disableSelectAll',
				'popupData',
				'selectedInfoList',
				
				'defaultPath',
			]),
			
			// 最大库存根据多规格属性的改变进行动态的改变
			maxStock() {
				if (!this.popupData_local.goodsSkus) return 0
				if (this.checkedSkusIndex < 0) return this.popupData_local.min_stock
				return this.popupData_local.goodsSkus[this.checkedSkusIndex].stock || 100
			},
			
			// 拿到选中的skus组成的多规格字符串
			checkedSkus() {
				let checkedSkus = this.attrsDataList.map(v => {
					return v.list[v.selected].name
				})
				return checkedSkus.join(",")
			},
			// 选中的多规格属性组 对应在价格对照表中的索引
			checkedSkusIndex() {
				let index = 0
				if (this.popupData_local.goodsSkus) {
					index = this.popupData_local.goodsSkus.findIndex((item) => {
						return item.skusText === this.checkedSkus
					})
				}
				return index
			},
			// 根据多规格属性的选择而动态计算的价格
			showPrice() {
				if (this.checkedSkusIndex < 0) return this.popupData_local.min_price || 0.00
				if (!this.popupData_local.goodsSkus) return 0.00
				return this.popupData_local.goodsSkus[this.checkedSkusIndex].pprice
			}
		},
		watch: {
			popupData(a, b) {
				if (typeof a.attrs === 'undefined') {
					this.popupData_local = {}
					this.attrsDataList = []
					return 
				}
				// 判断商品是否是多规格
				if (a.sku_type === 1) {
					this.attrsDataList = JSON.parse(JSON.stringify(a.attrs))
				}
				this.popupData_local = JSON.parse(JSON.stringify(a))
			}
		},
		filters: {
			// 拼接属性字段
			getAttrsStr(arr) {
				let attrStr = ""
				for (let attr of arr) {
					attrStr = attrStr + attr.list[attr.selected].name + ","
				}
				return attrStr.substr(0, attrStr.length - 1)
			},
			// 去除字符串最后一个逗号
			trimString(value) {
				let lastChar = value.charAt(value.length - 1)
				if (lastChar === ',') {
					return value.substr(0, value.length - 1)
				}
				return value
			}
		},
		onLoad: function() {
			
		},
		onShow: function() {
			
		},
		methods: {
			...mapMutations([
				'selectItem',
				'changeEditStatus',
				'addTempOrder',
				
				'attrsChange',
				'numChange'
			]),
			...mapActions([
				'doSelectAll',
				'doDelGoods',
				'doShowPopup',
				'doHidePopup'
			]),
			
			// 强制更新numberBox子组件  一种hack的强制更新子组件的方式 (组件依赖的state字段没有变化的情况下 需要强制的方式组件才会更新)
			forceRefreshNumber() {
				// 移除组件
				this.updateNum = false
				// 在组件移除后，重新渲染组件
				// this.$nextTick可实现在DOM 状态更新后，执行传入的方法。
				this.$nextTick(() => {
					this.updateNum = true
				})
			},
			changeNum: function(num, item, index) {
				if (this.popupIndex === -1 && index === -1) return
				item.num = num
				this.numChange({
					index: (this.popupIndex === -1)? index : this.popupIndex,
					num: num
				})
			},
			changeAttr: function() {
				this.attrsChange({
					index: this.popupIndex,
					attrs: this.attrsDataList,
					pprice: this.showPrice,
					maxnum: this.maxStock
				})
				this.doHidePopup()
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
			// 将购物车中选中的商品移入收藏夹
			moveToCollection: function() {
				// 判断是否有选中商品
				if (!this.someChecked) {
					return uni.showToast({title: '请先选择商品', icon: 'none'});
				}
				
				let collectList = uni.getStorageSync('collectList')
				collectList = collectList? JSON.parse(collectList) : []				
				let collectDetailList = uni.getStorageSync('collectDetailList')
				collectDetailList = collectDetailList? JSON.parse(collectDetailList) : []
				
				this.selectedInfoList.forEach(goods => {
					// 该商品已经在收藏夹里面的情况下 则更新到收藏夹列表的最前面
					if (this.isCollected(collectList, goods.id)) {
						// 先找到该商品并删除
						let index = collectList.indexOf(goods.id)
						collectList.splice(index, 1)
						collectDetailList.splice(index, 1)
					}
					// 不管是否已经在收藏夹中 都要加入收藏夹最前面
					collectList.unshift(goods.id)
					collectDetailList.unshift(goods)
				})
				uni.setStorageSync('collectList', JSON.stringify(collectList))
				uni.setStorageSync('collectDetailList', JSON.stringify(collectDetailList))
				// 最后再从购物车中删除这些商品
				this.doDelGoods(false)
				uni.showToast({title: '成功移入收藏夹', icon: 'none'});
			},
			// 判断当前商品id是否在收藏记录里面
			isCollected: function(collectList, goods_id) {
				if (!collectList || collectList.length === 0) return false
				let index = collectList.indexOf(goods_id)
				if (index === -1) return false
				return true
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
				// 不可以直接修改getter字段
				let selectedList = JSON.parse(JSON.stringify(this.selectedInfoList))
				// 处理商品信息中的字段
				selectedList.forEach(goods => {
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
				data.order_items = selectedList
				
				// 计算总的商品数
				let sum = 0
				data.order_items.forEach(v => {
					sum = sum + v.num
				})
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

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
							<view @tap="openGoodsDetail(item.id)" class="text-dark" :class="item.skus_type === 1?'mb-1':'mb-5 mt-2'" style="font-size: 32upx;line-height: 1.3;">
								{{ item.title }}
							</view>
							<!-- 商品的属性和规格 -->
							<view v-if="item.skus_type === 1" @tap.stop="ShowPopup(index, item)" class="d-flex a-center text-light-muted mb-2 mt-2 py-1 bg-light-secondary" style="width:fit-content;height:auto;border-radius: 8upx;padding-left: 15upx;padding-right: 15upx;">
								<text class="line-h mr-2 font-sm" style="width:auto;height:auto;max-width:50%px;">
									<!-- {{ item.attrs | getAttrsStr }} -->
									{{ item.skusText}}
								</text>
								<text class="iconfont icon-bottom line-h font-sm"></text>
							</view>
						</view>
						
						<view class="mt-auto d-flex j-sb pl-2">
							<price>{{ item.pprice }}</price>
							<view class="a-self-end">
								<uni-number-box @change="changeNum($event, item, index)" :value="item.num" :min="item.minnum" :max="item.maxnum"></uni-number-box>
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
		<view :style="'height: '+ (bottomHeight + 100) +'upx;background: white;'"></view>
		<!-- 价格合计组件 -->
		<view class="d-flex a-center a-stretch position-fixed left-0 right-0 border-top border-light-secondary bg-white" 
		:style="'height: 100upx;z-index: 1000;bottom: '+ bottomHeight +'upx;'">
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
				<view @tap="deleteGoods"
				class="flex-1 d-flex a-center j-center bg-danger text-white font-md" 
				hover-class="main-bg-hover-color">
					删除
				</view>
			</template>
		</view>
		
		<!-- 属性筛选弹出框 -->
		<sku-popup></sku-popup>
		
	</view>
</template>

<script>
	import loading from '@/common/mixin/loading.js';
	import uniNavBar from '@/components/uni-ui/uni-nav-bar/uni-nav-bar.vue'
	import price from '@/components/common/price.vue'
	import uniNumberBox from '@/components/uni-ui/uni-number-box/uni-number-box.vue'
	import commonList from '@/components/common/common-list.vue'
	import skuPopup from '@/components/cart/sku-popup.vue'
	
	import {mapState, mapGetters, mapMutations, mapActions} from 'vuex'
	export default {
		mixins: [loading],
		components: {
			uniNavBar,
			price,
			uniNumberBox,
			commonList,
			skuPopup
		},
		data() {
			return {
				// 底部tabBar的高度 (H5平台下底部tabBar因为不是原生控件 是div模拟的，所以会占用页面高度50px)
				// 价格合计栏距底部的距离 (fixed定位 bottom: 0upx;)
				bottomHeight: 0,
				
				hotList: []
			}
		},
		computed: {
			...mapState({
				isedit: state => state.cart.isedit,
				list: state => state.cart.list,
				selectedList: state => state.cart.selectedList,
				
				loginStatus: state => state.user.loginStatus,
			}),
			...mapGetters([
				'checkedAll',
				'someChecked',
				'totalPrice',
				'disableSelectAll',
				'selectedInfoList',
				'defaultPath',
			]),
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
			// 在H5(浏览器)平台下 因为没有原生控件这个概念，所以H5平台上的底部tabBar是uni-app用div构建模拟出来的
			// 所以在使用fixed绝对定位时，要考虑底部tabBar所占的50px的高度 (App和小程序平台下没有这个问题)
			// #ifdef H5
			this.bottomHeight = 100
			// #endif
			// #ifdef MP-WEIXIN
			this.bottomHeight = 100
			// #endif
			
			this.getData()
		},
		// beforeDestroy: function() {
		// 	console.log('cart will Destroy');
		// },
		onUnload: function() {
			console.log('cart will Unload');
		},
		onPullDownRefresh: function() {
			this.getData()
		},
		methods: {
			...mapMutations([
				'selectItem',
				'changeEditStatus',
				'addTempOrder',
				
				'numChange'
			]),
			...mapActions([
				'doSelectAll',
				'doDelGoods',
				'doShowPopup',
				'updateCartList'
			]),
			
			// 获取数据
			getData: function() {
				// 获取购物车数据
				this.updateCartList().then(res => {
					uni.stopPullDownRefresh()
				}).catch(err => {
					uni.stopPullDownRefresh()
				})
				
				// 获取热门商品列表数据
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
			
			ShowPopup: function(index, item) {
				this.$api.get('/cart/'+ item.id +'/sku', {}, 
					{token: true, toast: false}).then(res => {
					// 切割属性字段
					let arr = item.skusText.split(',')
					let selected = 0
				
					// 商品多规格弹出框数据
					res.selects = res.goods_skus_card.map((v, index) => {
						var list = v.goods_skus_card_value.map((v2, index2) => {
							if (v2.value === arr[index]) selected = index2
							return {
								id: v2.id,
								name: v2.value
							}
						})
						
						return {
							id: v.id,
							title: v.name,
							selected: selected,
							list: list
						}
					})
					// 商品多规格 匹配价格
					res.goods_skus.forEach(item => {
						let arr = []
						for (let key in item.skus) {
							arr.push(item.skus[key].value)
						}
						item.skusText = arr.join(",")
					})
					
					this.doShowPopup({
						index: index,
						data: res
					})
				})
			},
			
			changeNum: function(num, item, index) {
				if (index === -1 || item.num === num || num > item.maxnum) return
				uni.showLoading({mask: true, title: "修改中..."})
				this.$api.post('/cart/updatenumber/'+item.id, {num: num}, {token: true, toast: false}).then(res => {
					uni.hideLoading()
					item.num = num
					this.numChange({
						index: index,
						num: num
					})
				})
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
				// 先请求服务端删除对应的商品
				let ids = this.selectedList.join(',')
				this.$api.post('/cart/delete', {shop_ids: ids}, {token: true, toast: false}).then(res => {
					// 将商品加入到收藏夹中
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
						// 购物车商品数据中没有商品描述信息，暂时这样写
						goods.desc = "酒店格调，简约品味/双雕方空，繁艺简呈/新疆纯棉，百支醇密";
						// 不管是否已经在收藏夹中 都要加入收藏夹最前面
						collectList.unshift(goods.id)
						collectDetailList.unshift(goods)
					})
					uni.setStorageSync('collectList', JSON.stringify(collectList))
					uni.setStorageSync('collectDetailList', JSON.stringify(collectDetailList))
					
					// 最后再从购物车中删除这些商品
					this.doDelGoods(false)
					uni.showToast({title: '成功移入收藏夹', icon: 'none'});
				}).catch(err => {
					uni.showToast({title: '操作失败，请重试', icon: 'none'});
				})
			},
			// 判断当前商品id是否在收藏记录里面
			isCollected: function(collectList, goods_id) {
				if (!collectList || collectList.length === 0) return false
				let index = collectList.indexOf(goods_id)
				if (index === -1) return false
				return true
			},
			
			// 从购物车中删除商品
			deleteGoods: function() {
				// 判断是否有选中商品
				if (!this.someChecked) {
					return uni.showToast({title: '请先选择商品', icon: 'none'});
				}
				uni.showModal({
					content: "是否删除选中的商品",
					success: (res) => {
						if (res.confirm) {
							uni.showLoading({title: "商品删除中...", mask: true})
							let ids = this.selectedList.join(',')
							this.$api.post('/cart/delete', {shop_ids: ids}, {token: true, toast: false}).then(res => {
								this.doDelGoods(false)
								uni.hideLoading()
								uni.showToast({title: "删除成功"})
							})
						}
					}
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
				// 不可以直接修改getter字段
				let selectedList = JSON.parse(JSON.stringify(this.selectedInfoList))
				let sum = 0
				// 处理商品信息中的字段
				selectedList.forEach(goods => {
					// 删除订单中不需要的商品字段
					delete goods.checked
					delete goods.minnum
					delete goods.maxnum
					// 计算总的商品数
					sum = sum + goods.num
				})
				data.order_items = selectedList
				data.total_num = sum
				data.total_price = this.totalPrice
				// 判断是否有默认收货地址
				data.path_id = this.defaultPath.length > 0 ? this.defaultPath[0].id : 0
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

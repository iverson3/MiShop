<template>
	<view style="background-color: #F5F5F5;min-height: 100%;height: auto;">
		<!-- 地址选择 -->
		<view @click="openPathList" class="main-bg-color text-white d-flex a-center px-3" hover-class="main-bg-hover-color" style="height: 250upx;">
			<template v-if="path">
				<view>
					<view class="font-weight font-lg">
						{{ path.name }} {{ path.phone }} <text v-if="path.isdefault" class="border border-white px-1 rounded font ml-2">默认</text>
					</view>
					<view class="font">{{ path.province }} {{ path.city }} {{ path.district }} {{ path.address }}</view>
				</view>
			</template>
			<template v-else>
				<view class="font-weight font-lg">
					请选择收货地址
				</view>
			</template>
			<view class="iconfont icon-you text-white ml-auto"></view>
		</view>
		
		<view style="border-top-left-radius: 25upx;border-top-right-radius: 25upx;margin-top: -25upx;overflow: hidden;">
			<view class="bg-white">
				<uni-list-item showArrow @click="changePopup('show')">
					<view class="d-flex a-center">
						<template v-if="order.order_items.length > 3">
							<template v-for="i in 3">
								<image :key="i" :src="order.order_items[i].cover" class="rounded mr-2" style="width: 100upx;height: 100upx;"></image>
							</template>
						</template>
						<template v-else>
							<template v-for="(item,index) in order.order_items">
								<image :key="index" :src="item.cover" class="rounded mr-2" style="width: 100upx;height: 100upx;"></image>
							</template>
						</template>
					</view>
					<view slot="rightContent" class="">共{{ order.order_items.length }}件</view>
				</uni-list-item>
				<uni-list-item title="商品总价" :showArrowIcon="false">
					<view slot="rightContent">
						<price color="text-dark">{{ order.total_price }}</price>
					</view>
				</uni-list-item>
				<uni-list-item title="运费" :showArrowIcon="false">
					<view slot="rightContent">包邮</view>
				</uni-list-item>
				<uni-list-item title="优惠券" @click="openOrderCoupon">
					<view slot="rightContent" :class="couponCount === 0? 'text-light-muted' : 'main-text-color'">
						<text v-if="useCoupon.id > 0">{{ useCoupon.type === 0? '-'+useCoupon.value+'元' : useCoupon.value+'折' }}</text>
						<text v-else>{{ couponCount === 0? '无可用' : couponCount + '张可用' }}</text>
					</view>
				</uni-list-item>
				
				<uni-list-item :showArrowIcon="false">
					<text class="main-text-color">小计</text>
					<view slot="rightContent">
						<price>{{ realPayPrice }}</price>
					</view>
				</uni-list-item>
				<divider></divider>
				<uni-list-item title="发票" extraWidth="40%" @click="openOrderInvoice">
					<view slot="rightContent">电子发票-个人</view>
				</uni-list-item>
			</view>
		</view>
		
		<view class="w-100 position-fixed bottom-0 left-0 right-0 d-flex a-center j-end bg-white p-2 font-md border-top">
			合计：<price>{{ realPayPrice }}</price>
			<view class="px-2 py-1 rounded text-white mx-4 font-md" 
			@tap="openPayMethods" :class="ordering ? 'bg-secondary' : 'main-bg-color'"
			hover-class="main-bg-hover-color">
				{{ ordering ? '下单中' : '去支付' }}
			</view>
		</view>
		
		<!-- 商品信息列表弹出框 -->
		<common-popup :popupClass="isShowPopup" :popupHeight="popupHeight" @hide="changePopup('none')">
			<card headTitle="订单商品列表">
				<scroll-view scroll-y class="w-100" :style="'height:'+(popupHeight - 120)+'upx;'">
					<block v-for="(item,index) in order.order_items" :key="index">
						<order-list-item :goods="item" :index="index"></order-list-item>
					</block>
				</scroll-view>
			</card>
		</common-popup>
	</view>
</template>

<script>
	import uniListItem from '@/components/uni-ui/uni-list-item/uni-list-item.vue'
	import price from '@/components/common/price.vue'
	import commonPopup from '@/components/common/common-popup.vue'
	import orderListItem from '@/components/order/order-list-item.vue'
	import card from '@/components/common/card.vue'
	import utils from '@/common/lib/utils.js';
	
	import {mapState, mapGetters, mapMutations, mapActions} from 'vuex'
	export default {
		components: {
			uniListItem,
			price,
			commonPopup,
			orderListItem,
			card
		},
		data() {
			return {
				path: false,
				order: {},
				isShowPopup: 'none',
				couponCount: 0,
				useCoupon: {
					id: 0,
					type: 0,
					value: 0
				},
				ordering: false,   // 是否正在下单请求中
				
				// 弹出框的高度是250的整数倍
				popupHeight: 250
			}
		},
		
		computed: {
			...mapState({
				tempOrder: state => state.order.tempOrder,
				selectedList: state => state.cart.selectedList
			}),
			...mapGetters(['defaultPath', 'getPathById']),
			
			// 实际支付金额 (计算优惠券)
			realPayPrice() {
				// 没有优惠券
				if (this.useCoupon.id === 0) return this.order.total_price
				// 处理优惠券
				if (this.useCoupon.type === 0) {
					// 满减
					return (this.order.total_price - this.useCoupon.value).toFixed(2)
				} else {
					// 折扣
					return (this.order.total_price * (this.useCoupon.value / 10)).toFixed(2)
				}
			}
		},
		onLoad: function() {
			this.order = JSON.parse(JSON.stringify(this.tempOrder))
			// 给个初始值 后面再根据页面的选择进行修改
			this.order.pay_price = this.order.total_price
			this.order.freight   = 0
			this.order.coupon_id = 0
			
			console.log(JSON.stringify(this.selectedList));
			
			if (this.order.path_id !== 0) {
				// 通过path_id获取path完整信息
				let path = this.getPathById(this.order.path_id)
				this.path = path ? path : false
			}
			// 根据当前订单所包含的商品的数量 计算弹出框所需的高度 (多加的100高度是给弹出框标题用的)
			if (this.order.order_items.length > 4) {
				this.popupHeight = this.popupHeight * 4 + 100
			} else {
				this.popupHeight = this.popupHeight * this.order.order_items.length + 100
			}
			// 获取当前订单总价可使用的优惠券数量
			this.getCouponCount()
			// 监听优惠券的选择事件
			uni.$on('chooseCoupon', (res) => {
				this.useCoupon = res
			})
			// 监听选择收货地址事件
			uni.$on('choosePath', (res) => {
				this.path = res
				// 用户选择新地址之后 修改订单里面的地址id
				this.order.path_id = res.id
			})
		},
		onUnload: function() {
			uni.$off('chooseCoupon')
			uni.$off('choosePath')
		},
		onBackPress: function() {
			this.deleteTempOrder()
			return false
		},
		methods: {
			...mapMutations(['deleteTempOrder']),
			...mapActions(['doCreateOrder', 'doDelGoods']),
			
			// 获取当前订单总价可使用的优惠券数量
			getCouponCount: function() {
				this.$api.post('/coupon_count', {price: this.order.pay_price}, {token: true, toast: false}).then(res => {
					this.couponCount = res
				}).catch(err => {
					uni.showToast({title: '获取优惠券信息失败', icon: 'none'});
				})
			},
			openPathList: function() {
				uni.navigateTo({
					url: '/pages/user-path-list/user-path-list?type=choose'
				})
			},
			openOrderCoupon: function() {
				uni.navigateTo({
					url: '/pages/order-coupon/order-coupon?price=' + this.order.pay_price
				})
			},
			openOrderInvoice: function() {
				uni.navigateTo({
					url: '/pages/order-invoice/order-invoice'
				})
			},
			changePopup: function(isShow) {
				if (isShow === 'none') {
					this.isShowPopup = 'hide'
					setTimeout(() => {
						this.isShowPopup = 'none'
					}, 200)
				} else {
					this.isShowPopup = 'show'
				}
			},
			openPayMethods: function() {
				if (this.order.path_id === 0) return uni.showToast({title: '请选择收货地址', icon: 'none'});
				if (this.ordering) return
				
				let options = {
					user_addresses_id: this.order.path_id,
					items: this.selectedList.join(',')
				}
				if (this.useCoupon.id > 0) {
					options.coupon_user_id = this.useCoupon.id
				}
				this.ordering = true
				this.$api.post('/order', options, {token: true, toast: false}).then(res => {
					console.log(res);
		
					this.order.id = parseInt(res.id)
					this.order.orderNo = res.no
					this.order.create_time = utils.dateStringToTime(res.create_time)
					this.order.statusNo = 1
					this.order.status = "待支付"
					this.order.freight = 0
					this.order.coupon_id = this.useCoupon.id
					this.order.pay_price = this.realPayPrice
					
					this.doCreateOrder(this.order)
					// 正式生成订单后 删除进入订单的商品(即选中的商品)
					let ids = this.selectedList.join(',')
					this.$api.post('/cart/delete', {shop_ids: ids}, {token: true, toast: false}).then(res => {
						this.doDelGoods(false)
					}).catch(err => {
						console.log(err);
					})
					
					this.ordering = false
					uni.redirectTo({
						url: "/pages/pay-methods/pay-methods?orderid=" + this.order.id
					})
					
				}).catch(err => {
					this.ordering = false
					uni.showToast({title: '创建订单失败，请重试', icon: 'none'});
				})
				
			}
		}
	}
</script>

<style>

</style>

<template>
	<view style="background-color: #F5F5F5;min-height: 100%;height: auto;">
		<!-- 地址选择 -->
		<view @click="openPathList" class="main-bg-color text-white d-flex a-center px-3" hover-class="main-bg-hover-color" style="height: 250upx;">
			<template v-if="path">
				<view>
					<view class="font-weight font-lg">
						{{ path.name }} {{ path.phone }} <text v-if="path.isdefault" class="border border-white px-1 rounded font ml-2">默认</text>
					</view>
					<view class="font">{{ path.path }} {{ path.detailPath }}</view>
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
				<uni-list-item showArrow>
					<view class="d-flex a-center">
						<image src="/static/images/demo/demo6.jpg" class="rounded mr-2" style="width: 100upx;height: 100upx;"></image>
						<image src="/static/images/demo/demo6.jpg" class="rounded mr-2" style="width: 100upx;height: 100upx;"></image>
						<image src="/static/images/demo/demo6.jpg" class="rounded mr-2" style="width: 100upx;height: 100upx;"></image>
					</view>
					<view slot="rightContent" class="">共3件</view>
				</uni-list-item>
				<uni-list-item title="商品总价" :showArrowIcon="false">
					<view slot="rightContent">
						<price color="text-dark">20.00</price>
					</view>
				</uni-list-item>
				<uni-list-item title="运费" :showArrowIcon="false">
					<view slot="rightContent">包邮</view>
				</uni-list-item>
				<navigator url="/pages/order-coupon/order-coupon">
					<uni-list-item title="优惠券">
						<view slot="rightContent" class="text-light-muted">无可用</view>
					</uni-list-item>
				</navigator>
				
				<uni-list-item :showArrowIcon="false">
					<text class="main-text-color">小计</text>
					<view slot="rightContent">
						<price>20.00</price>
					</view>
				</uni-list-item>
				<divider></divider>
				<uni-list-item title="发票" extraWidth="40%" @click="openOrderInvoice">
					<view slot="rightContent">电子发票-个人</view>
				</uni-list-item>
			</view>
		</view>
		
		<view class="w-100 position-fixed bottom-0 left-0 right-0 d-flex a-center j-end bg-white p-2 font-md border-top">
			合计：<price>25.00</price>
			<view class="main-bg-color px-2 py-1 rounded text-white mx-4 font-md" 
			@tap="openPayMethods"
			hover-class="main-bg-hover-color">
				去支付
			</view>
		</view>
	</view>
</template>

<script>
	import uniListItem from '@/components/uni-ui/uni-list-item/uni-list-item.vue'
	import price from '@/components/common/price.vue'
	
	import {mapGetters} from 'vuex'
	export default {
		components: {
			uniListItem,
			price
		},
		data() {
			return {
				path: false
			}
		},
		computed: {
			...mapGetters(['defaultPath'])
		},
		onLoad: function() {
			if (this.defaultPath.length > 0) {
				this.path = this.defaultPath[0]
			} else {
				this.path = false
			}
			
			// 监听选择收货地址事件
			uni.$on('choosePath', (res) => {
				this.path = res
			})
		},
		onUnload: function() {
			uni.$off('choosePath', (e) => {
				console.log('卸载选择收货地址的事件监听器')
			})
		},
		methods: {
			openPathList: function() {
				uni.navigateTo({
					url: '/pages/user-path-list/user-path-list?type=choose'
				})
			},
			openOrderInvoice: function() {
				uni.navigateTo({
					url: '/pages/order-invoice/order-invoice'
				})
			},
			openPayMethods: function() {
				uni.redirectTo({
					url: "/pages/pay-methods/pay-methods"
				})
			}
		}
	}
</script>

<style>

</style>

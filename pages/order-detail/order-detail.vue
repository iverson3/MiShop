<template>
	<view>
		<view class="main-bg-color p-4 text-white d-flex a-end j-sb" style="height: 300upx;">
			<view class="mb-3">
				<view class="font-lg">卖家已发货</view>
				<view class="font">还差7天10时自动确认</view>
			</view>
			<view class="iconfont icon-daishouhuo line-h mb-3" style="font-size: 100upx;"></view>
		</view>
		
		<view class="p-3">
			<view class="text-light-muted font-md">
				<text class="font-lg text-dark mr-2">小贱</text>
				13396095889
			</view>
			<view class="text-light-muted font-md">
				广东省 深圳市 南山区 xxx街道 明亮科技园 2栋122
			</view>
		</view>
		<divider></divider>
		<view class="px-2">
			<block v-for="(item,index) in order_items" :key="index">
				<order-list-item :goods="item" :index="index"></order-list-item>
			</block>
		</view>
		<divider></divider>
		
		<uni-list-item>
			<text class="font-md text-light-muted">商品总价</text>
			<view slot="right" class="font-md text-light-muted">￥128.00</view>
		</uni-list-item>
		<uni-list-item>
			<text class="font-md text-light-muted">快递</text>
			<view slot="right" class="font-md text-light-muted">免邮</view>
		</uni-list-item>
		<uni-list-item>
			<text class="font-md text-light-muted">优惠券</text>
			<view slot="right" class="font-md text-light-muted">-￥20.00</view>
		</uni-list-item>
		<uni-list-item>
			<text class="font-md main-text-color">实际付款</text>
			<view slot="right" class="font-md main-text-color">
				<price>108.00</price>
			</view>
		</uni-list-item>
		<divider></divider>
		
		<card headTitle="订单信息">
			<uni-list-item title="订单编号" extraWidth="40%">
				<view slot="right" class="font-md text-light-muted">1235346523745</view>
			</uni-list-item>
		</card>
	</view>
</template>

<script>
	import orderListItem from '@/components/order/order-list-item.vue'
	import uniListItem from '@/components/uni-ui/uni-list-item/uni-list-item.vue'
	import price from '@/components/common/price.vue'
	import card from '@/components/common/card.vue'
	
	export default {
		components: {
			orderListItem,
			uniListItem,
			price,
			card
		},
		data() {
			return {
				order_items: [
					{
						cover: "/static/images/demo/list/1.jpg",
						title: "小米8",
						pprice: 1999.00,
						attrs: "金色 标配",
						num: 1
					},
					{
						cover: "/static/images/demo/list/1.jpg",
						title: "小米8",
						pprice: 1999.00,
						attrs: "金色 标配",
						num: 1
					}
				],
			}
		},
		methods: {
			
		}
	}
</script>

<style>

</style>

<template>
	<view>
		<view class="main-bg-color p-4 text-white d-flex a-end j-sb" style="height: 300upx;">
			<view class="mb-3">
				<view class="font-lg">{{ orderStatus }}</view>
				<view class="font">{{ timeDownText }}</view>
			</view>
			<view class="iconfont line-h mb-3" :class="orderStatusIcon" style="font-size: 100upx;"></view>
		</view>
		
		<view class="p-3">
			<view class="text-light-muted font-md">
				<text class="font-lg text-dark mr-2">{{ orderInfo.address.name }}</text>
				{{ orderInfo.address.phone }}
			</view>
			<view class="text-light-muted font-md">
				{{ path }}
			</view>
		</view>
		<divider></divider>
		<view class="px-2">
			<block v-for="(item,index) in orderInfo.orderItems" :key="index">
				<order-list-item :goods="item" :index="index"></order-list-item>
			</block>
		</view>
		<divider></divider>
		
		<uni-list-item>
			<text class="font-md text-light-muted">商品总价</text>
			<view slot="right" class="font-md text-light-muted">￥{{ goodsPrice }}</view>
		</uni-list-item>
		<uni-list-item>
			<text class="font-md text-light-muted">快递</text>
			<view slot="right" class="font-md text-light-muted">{{ orderInfo.freight === 0? '免邮' : orderInfo.freight }}</view>
		</uni-list-item>
		<uni-list-item extraWidth="40%">
			<text class="font-md text-light-muted">优惠券</text>
			<view slot="right" class="font-md text-light-muted">{{ coupon }}</view>
		</uni-list-item>
		<uni-list-item>
			<text class="font-md main-text-color">实际付款</text>
			<view slot="right" class="font-md main-text-color">
				<price>{{ orderInfo.total_price }}</price>
			</view>
		</uni-list-item>
		<divider></divider>
		
		<card headTitle="订单信息">
			<uni-list-item title="订单编号" extraWidth="50%">
				<view slot="right" class="font-md text-light-muted">{{ orderInfo.no }}</view>
			</uni-list-item>
			<uni-list-item title="支付时间" extraWidth="60%">
				<view slot="right" class="font-md text-light-muted">{{ orderInfo.create_time }}</view>
			</uni-list-item>
		</card>
		<card v-if="orderInfo.extra" headTitle="退款信息">
			<uni-list-item title="退款原因" extraWidth="50%">
				<view slot="right" class="font-md text-light-muted">{{ orderInfo.extra.refund_reason }}</view>
			</uni-list-item>
			<uni-list-item title="退款结果" extraWidth="60%">
				<view slot="right" class="font-md text-light-muted">{{ orderStatus }}</view>
			</uni-list-item>
		</card>
		
		<view v-if="orderStatus && orderStatusNo && orderStatusNo < 5" class="w-100 bg-white" style="height: 100upx;"></view>
		<view v-if="orderStatus && orderStatusNo && orderStatusNo < 5" class="position-fixed bottom-0 left-0 right-0 w-100 d-flex a-center j-end pr-3 bg-white" style="height: 100upx;">
			
			<!-- 如果是待支付状态 可以取消订单/去支付 -->
			<!-- 如果是支付失败状态 可以去支付/取消订单 -->
			<template v-if="orderStatusNo === 1 || orderStatusNo === 5">
				<common-button @click="openPayMethod">{{ orderStatusNo === 1?'去支付':'重新支付'}}</common-button>
				<common-button @click="cancelOrder">取消订单</common-button>
			</template>
			
			<!-- 如果是待发货状态 可以取消订单 -->
			<template v-else-if="orderStatusNo === 2">
				<common-button>提醒发货</common-button>
				<common-button @click="applyRefund">申请退款</common-button>
				<!-- <common-button @click="cancelOrder">取消订单</common-button> -->
			</template>
			
			<!-- 如果是待收货状态 可以取消订单/确认收货 -->
			<template v-else-if="orderStatusNo === 3">
				<common-button @click="completeOrder">确认收货</common-button>
				<common-button @click="openLogistics">查看物流</common-button>
			</template>
			
			
			
			<!-- 如果是待评价状态 可以申请退货/去评价/再买一单 -->
			<template v-else-if="orderStatusNo === 4">
				<common-button @click="openAfterSale">申请售后</common-button>
				<common-button @click="toComment">去评价</common-button>
				<!-- <common-button>再买一单</common-button> -->
			</template>
			
			<!-- 如果是已取消状态  可以删除订单/重新下单 -->
			<template v-else-if="orderStatusNo === 6">
				<common-button @click="reOrder">重新下单</common-button>
				<common-button @click="deleteOrder">删除订单</common-button>
			</template>
			<!-- 如果是退货退款状态 可以退货退款完成 -->
			<template v-else-if="orderStatusNo === 7">
				<common-button>退货退款完成</common-button>
			</template>
		</view>
	
	</view>
</template>

<script>
	import orderListItem from '@/components/order/order-list-item.vue'
	import uniListItem from '@/components/uni-ui/uni-list-item/uni-list-item.vue'
	import price from '@/components/common/price.vue'
	import card from '@/components/common/card.vue'
	import commonButton from '@/components/common/common-button.vue';
	import utils from '@/common/lib/utils.js';
	
	import {mapState, mapGetters, mapMutations} from 'vuex'
	export default {
		components: {
			orderListItem,
			uniListItem,
			price,
			card,
			commonButton
		},
		data() {
			return {
				orderid: 0,
				orderInfo: {
					id: 0,
					no: "",
					address: {       // 收货地址信息
						province: "",
						city: "",
						district: "",
						address: "",
						zip: 0,
						name: "",
						phone: ""
					},
					total_price: 0,   // 实际支付金额
					freight: 0,
					remark: "",
					paid_time: null,  // 支付时间
					payment_method: "",
					payment_no: "",   // 支付流水号
					refund_status: "pending", // 退款状态
					ship_status: "",  // 物流状态
					extra: null,      // 退款相关信息
					create_time: "",
					update_time: "",
					reviewed: 0,      // 评论相关信息
					orderItems: [],
					couponUserItem: [],// 优惠券信息
					end_time: 0,       // 自动取消"待支付"订单的最后时间
				},
				timer: null,
				timeDown: '',
				
				// 状态值： 0-未知 1-待支付 2-待发货 3-待收货 4-待评价 5-支付失败 6-已取消 7-退货退款中 8-退款成功 9-退款失败
				statusInfoList: [
					{
						title: "未知状态订单",
						desc: "你的订单状态暂时未知，请重试",
						icon: "icon-unknown"
					},
					{
						title: "待支付订单",
						desc: "您还有xxxx时间去进行支付，过期将自动取消",
						icon: "icon-daifukuan"
					},
					{
						title: "待发货订单",
						desc: "您的订单即将发货，请耐心等待",
						icon: "icon-daifahuo"
					},
					{
						title: "卖家已发货",
						desc: "还差7天10时自动确认",
						icon: "icon-daishouhuo"
					},
					{
						title: "待评价订单",
						desc: "快去给订单写个评价吧",
						icon: "icon-daipingjia"
					},
					{
						title: "支付失败",
						desc: "支付失败，请重新支付",
						icon: "icon-daipingjia"
					},
					{
						title: "已取消，交易关闭",
						desc: "取消订单的原因信息",
						icon: "icon-daipingjia"
					},
					{
						title: "退货退款订单",
						desc: "您的订单退货退款请求正在处理中",
						icon: "icon-tuihuo"
					}
				]
			}
		},
		computed: {
			...mapState({
				statusList: state => state.order.statusList
			}),
			...mapGetters(['getOrderInfoById', 'getPathById']),
			
			// 商品总价
			goodsPrice() {
				let p = 0
				this.orderInfo.orderItems.forEach(item => {
					p = p + item.pprice * item.num
				})
				return p.toFixed(2)
			},
			coupon() {
				if (Array.isArray(this.orderInfo.couponUserItem) && this.orderInfo.couponUserItem.length === 0) {
					return '未使用'
				}
				let { type, value } = this.orderInfo.couponUserItem.coupon
				if (type === 0) return '-￥' + value
				else return '打' + value + '折'
			},
			path() {
				let {province, city, district, address} = this.orderInfo.address
				return `${province} ${city} ${district} ${address}`
			},
			orderStatus() {
				return this.$help.formatOrderStatus({
					paid_time: this.orderInfo.paid_time,
					refund_status: this.orderInfo.refund_status,
					ship_status: this.orderInfo.ship_status
				})
			},
			orderStatusIcon() {
				let statusObj = this.statusList.find(obj => obj.status === this.orderStatus)
				return statusObj.icon
			},
			orderStatusNo() {
				let statusObj = this.statusList.find(obj => obj.status === this.orderStatus)
				return statusObj.statusNo
			},
			timeDownText() {
				let msg = ""
				switch (this.orderStatus){
					case '待支付':
						msg = "取消"
						break;
					case '待收货':
						msg = "确认"
						break;
					case '待发货':
						msg = "等待商家发货"
						break;
					case '退款中':
						msg = "等待商家审核"
						break;
					case '已签收':
						msg = "订单已签收"
						break;
					default:
						break;
				}
				if (msg !== '' && this.timeDown !== '') {
					return `还差 ${this.timeDown} 自动${msg}`
				}
				return ''
			}
		},
		onLoad: function(e) {
			if (e.orderid) {
				this.orderid = e.orderid
			} else {
				uni.showModal({
					title: '提示',
					content: '该订单不存在',
					showCancel: false,
					complete: () => {
						uni.navigateBack({delta: 1})
					}
				});
			}
		},
		onShow: function() {
			this.getOrderInfo()
		},
		onBackPress: function() {
			let pages = getCurrentPages()
			switch (pages[pages.length - 2].route){
				case 'pages/order-detail/order-detail':
					uni.redirectTo({
						url: "/pages/order/order"
					})
					return true
					break;
				default:
					break;
			}
			return false
		},
		onUnload: function() {
			if (this.timer) clearInterval(this.timer)
		},
		methods: {
			...mapMutations(['changeOrderStatus', 'deleteOrderById', 'reCreateOrder']),
			
			// 获取订单详情
			getOrderInfo: function() {
				this.$api.get('/order/' + this.orderid, {}, {token: true, toast: false}).then(res => {
					console.log(res);
					
					this.orderInfo.id = res.id
					this.orderInfo.no = res.no
					this.orderInfo.address = res.address
					this.orderInfo.total_price = res.total_price
					this.orderInfo.remark = res.remark
					this.orderInfo.paid_time = res.paid_time
					this.orderInfo.payment_method = res.payment_method
					this.orderInfo.payment_no = res.payment_no
					this.orderInfo.refund_status = res.refund_status
					this.orderInfo.ship_status = res.ship_status
					this.orderInfo.extra = res.extra
					this.orderInfo.create_time = res.create_time
					this.orderInfo.update_time = res.update_time
					this.orderInfo.reviewed = res.reviewed
					
					let total_num = 0
					let order_items = res.orderItems.map(v => {
						let attrs = []
						if (v.skus_type === 1 && v.goodsSkus && v.goodsSkus.skus) {
							let skus = v.goodsSkus.skus
							for (let k in skus) {
								attrs.push(skus[k].value)
							}
						}
						total_num = total_num + v.num
						return {
							id: v.goods_id,
							cover: v.goodsItem.cover,
							title: v.goodsItem.title,
							pprice: v.price,
							skusText: attrs.join(','),
							num: v.num
						}
					})
					
					this.orderInfo.orderItems = order_items
					this.orderInfo.couponUserItem = res.couponUserItem
					this.orderInfo.end_time = res.end_time? res.end_time : 0
					// 开启定时器
					this.openTimeDown()
						
				}).catch(err => {
					console.log(err);
					uni.showToast({title: '订单加载失败', icon: 'none'});
					uni.navigateBack({delta: 1});
				})
			},
			
			openTimeDown: function() {
				if (this.orderStatus === '待支付' || this.orderStatus === '待收货') {
					if (this.timer) clearInterval(this.timer)
					this.timer = setInterval(() => {
						let now = (new Date().getTime()) / 1000
						if (now >= this.orderInfo.end_time) {
							clearInterval(this.timer)
							uni.navigateBack({delta: 1});
							uni.showToast({
								title: this.orderStatus === '待支付'? '订单已关闭' : '已确认收货',
								icon: 'none'
							});
						} else {
							this.timeDown = utils.getTimeDown(this.orderInfo.end_time)
						}
					}, 1000)
				}
			},
			
			// 申请退款
			applyRefund: function() {
				uni.navigateTo({
					url: '/pages/order-refund/order-refund?orderid=' + this.orderInfo.id
				});
			},
			// 去支付
			openPayMethod: function() {
				uni.navigateTo({
					url: "/pages/pay-methods/pay-methods?orderid=" + this.orderInfo.id + "&price=" + this.orderInfo.total_price
				});
			},
			openDetail: function() {
				uni.navigateTo({
					url: "/pages/order-detail/order-detail?orderid=" + this.orderInfo.id
				})
			},
			// 查看物流
			openLogistics: function() {
				uni.navigateTo({
					url: "/pages/logistics-detail/logistics-detail?orderid=" + this.orderInfo.id
				})
			},
			// 取消订单
			cancelOrder: function() {
				uni.showModal({
					content: '确定要取消该订单么？',
					success: (res) => {
						if (res.confirm) {
							uni.showLoading({title: '取消订单中...', mask: true});
							this.$api.post('/closeorder/'+ this.orderInfo.id, {}, {token: true, toast: false}).then(res => {
								uni.hideLoading()
								uni.navigateBack({delta: 1});
								uni.showToast({title: '取消订单成功', icon: 'none'});
							}).catch(err => {
								uni.hideLoading()
								uni.showToast({title: '取消订单失败', icon: 'none'});
							})
						}
					}
				});
			},
			// 确认收货
			completeOrder: function() {
				uni.showModal({
					content: '是否要确认收货?',
					success: res => {
						if (res.confirm) {
							uni.showLoading({title: "确认收货中...", mask: true})
							
							this.$api.post('/order/'+this.orderInfo.id+'/received', {}, {token: true, toast: false}).then(res => {
								uni.hideLoading()
								uni.navigateBack({delta: 1});
								uni.showToast({title: '确认收货成功', icon: 'success'});
							}).catch(err => {
								uni.hideLoading()
								uni.showToast({title: '确认收货失败', icon: 'none'});
							})
						}
					}
				});
			},
			
			
			// 去评价
			toComment: function() {
				uni.navigateTo({
					url: '/pages/comment/comment?orderid=' + this.orderInfo.id
				});
			},
			
			// 删除订单
			deleteOrder: function() {
				// this.deleteOrderById(id)
				uni.showToast({title: '删除成功', icon: 'none'});
				uni.navigateBack({delta: 1});
			},
			
			
			
			// 申请售后
			openAfterSale: function() {
				uni.navigateTo({
					url: "/pages/after-sale/after-sale?orderid=" + this.orderInfo.id
				})
			},
			// 重新下单
			reOrder: function() {
			}
			
		}
	}
</script>

<style>

</style>

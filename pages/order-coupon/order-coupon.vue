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
		<view class="w-100" style="height: 90upx;"></view>
		
		<scroll-view scroll-y class="flex-1" style="background-color: #F5F5F5;">
			<!-- 优惠券列表 -->
			<block v-for="(tab,tabI) in tabBars" :key="tabI">
				<view class="position-relative" v-show="tabI === tabIndex" style="min-height: 400upx;">
					<template v-if="tab.list.length > 0">
						<view class="p-3">
							<!-- 列表 -->
							<coupon @click="useCoupon(item)" v-for="(item,index) in tab.list" :key="index" :item="item" :index="index">
								<text v-if="item.disabled">已使用</text>
								<text v-else>{{ item.status ? '去使用' : validText }}</text>
							</coupon>
						</view>
					</template>
					
					<template v-else>
						<!-- 没有优惠券 -->
						<no-thing :icon="tab.no_thing" :msg="tab.msg"></no-thing>
					</template>
				</view>
			</block>
		</scroll-view>
		
	</view>
</template>

<script>
	import noThing from '@/components/common/no-thing.vue'
	import coupon from '@/components/order-coupon/coupon.vue'
	
	export default {
		components: {
			noThing,
			coupon
		},
		data() {
			return {
				tabIndex: 0,
				price: 0,
				tabBars: [
					{
						name:"可用",
						page: 1,
						key: 'valid',
						firstLoaded: false,
						no_thing: "no_receiving",
						msg: "没有可用的优惠券",
						list: []
					},
					{
						name:"已失效",
						page: 1,
						key: 'invalid',
						firstLoaded: false,
						no_thing: "no_comment",
						msg: "没有已失效的优惠券",
						list: []
					}
				],
				
			}
		},
		computed: {
			page() {
				return this.tabBars[this.tabIndex].page
			},
			isValid() {
				return this.tabBars[this.tabIndex].key
			},
			validText() {
				return this.tabIndex === 0 ? '不可用' : '已失效'
			}
		},
		onLoad: function(e) {
			if (e.price) {
				this.price = parseFloat(e.price)
			}
			this.getData()
		},
		methods: {
			getData: function() {
				let index = this.tabIndex
				this.$api.get('/usercoupon/' + this.page + '/' + this.isValid, {}, {token: true, toast: false}).then(res => {
					
					this.tabBars[index].list = res.map(item => {
						// 订单总金额必须大于等于优惠券的使用限定价格才可使用该优惠券
						let status = (index === 0) && (this.price >= parseFloat(item.coupon.min_price))
						return {
							id: item.id,
							title: item.coupon.name,
							start_time: item.coupon.start_time,
							end_time: item.coupon.end_time,
							price: item.coupon.value,
							desc: item.coupon.desc,
							status: status,
							disabled: item.used,     // 是否已使用
							type: item.coupon.type   // 优惠券类型(满减or折扣)
						}
					})
					this.tabBars[index].firstLoaded = true
				}).catch(err => {
					uni.showToast({title: '优惠券加载失败', icon: 'none'});
				})
			},
			changeTab: function(index) {
				this.tabIndex = index
				// 判断是否已经首次加载过数据了
				if (!this.tabBars[index].firstLoaded) {
					this.getData()
				}
			},
			// 用户点击使用优惠券
			useCoupon: function(item) {
				if (item.disabled || !item.status) return
				uni.$emit('chooseCoupon', {
					id: item.id,
					type: item.type,
					value: item.price
				})
				uni.navigateBack({delta: 1})
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

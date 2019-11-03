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
							<coupon v-for="(item,index) in tab.list" :key="index" :item="item" :index="index"></coupon>
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
				tabBars: [
					{
						name:"可用",
						no_thing: "no_receiving",
						msg: "没有可用的优惠券",
						list: [
							{
								title: "第三季仿微信立减100元",
								start_time: "2019-08-12",
								end_time: "2019-10-01",
								price: 100,
								desc: "满300元使用",
								status: true,
								disabled: false
							},
							{
								title: "第三季仿微信立减100元",
								start_time: "2019-08-12",
								end_time: "2019-10-01",
								price: 100,
								desc: "满300元使用",
								status: true,
								disabled: true
							},
							{
								title: "第三季仿微信立减100元",
								start_time: "2019-08-12",
								end_time: "2019-10-01",
								price: 100,
								desc: "满300元使用",
								status: true,
								disabled: true
							}
						]
					},
					{
						name:"已失效",
						no_thing: "no_comment",
						msg: "没有已失效的优惠券",
						list: [
							{
								title: "第三季仿微信立减100元",
								start_time: "2019-08-12",
								end_time: "2019-10-01",
								price: 100,
								desc: "满300元使用",
								status: false,
								disabled: true
							},
							{
								title: "第三季仿微信立减100元",
								start_time: "2019-08-12",
								end_time: "2019-10-01",
								price: 100,
								desc: "满300元使用",
								status: false,
								disabled: true
							},
							{
								title: "第三季仿微信立减100元",
								start_time: "2019-08-12",
								end_time: "2019-10-01",
								price: 100,
								desc: "满300元使用",
								status: false,
								disabled: true
							}
						]
					}
				],
				
			}
		},
		methods: {
			changeTab: function(index) {
				this.tabIndex = index
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

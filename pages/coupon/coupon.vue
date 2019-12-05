<template>
	<view class="p-3">
		<coupon v-if="list.length > 0" v-for="(item,index) in list" :key="index" @click="getCoupon(item)" :item="item" :index="index">
			<text v-if="!item.status">已领取</text>
			<text v-else-if="item.disabled">已失效</text>
			<text v-else>立即领取</text>
		</coupon>
		
		<no-thing v-else icon="no_comment" msg="没有优惠券"></no-thing>
	</view>
</template>

<script>
	import coupon from '@/components/order-coupon/coupon.vue'
	import noThing from '@/components/common/no-thing.vue'
	
	export default {
		components: {
			coupon,
			noThing
		},
		data() {
			return {
				page: 1,
				list: []
			}
		},
		onLoad: function() {
			this.getData()
		},
		methods: {
			getData: function() {
				this.$api.get('/coupon/' + this.page, {}, {token: true, toast: false}).then(res => {
					
					this.list = res.map(item => {
						let time = (new Date()).getTime()
						let status = (item.end_time > time/1000) && item.status
						
						return {
							id: item.id,
							title: item.name,
							start_time: item.start_time,
							end_time: item.end_time,
							price: item.value,
							desc: item.desc,
							status: status, // false已失效
							disabled: (item.coupon_user.length > 0) // true已领取
						}
					})
					
				}).catch(err => {
					uni.showToast({title: '优惠券加载失败', icon: 'none'});
				})
			},
			
			// 领取优惠券
			getCoupon: function(item) {
				this.$api.post('/getcoupon/' + item.id, {}, {token: true, toast: false}).then(res => {
					item.disabled = true
					uni.showToast({title: '领取成功', icon: "success"});
				}).catch(err => {
					uni.showToast({title: '领取失败', icon: "none"});
				})
			}
		}
	}
</script>

<style>

</style>

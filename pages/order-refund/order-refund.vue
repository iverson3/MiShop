<template>
	<view>
		<textarea v-model="reason" class="uni-textarea p-2" placeholder="请填写退款理由" />
		
		<view class="p-3">
			<button type="default" class="bg-white" @click="submit" 
			:disabled="reason.length === 0" :loading="loading">{{ loading? '处理中...' : '申请退款'}}</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				orderid: 0,
				reason: "",
				loading: false
			}
		},
		onLoad: function(e) {
			if (e.orderid) {
				this.orderid = e.orderid
			} else {
				uni.showToast({title: '参数不完整', icon: 'none'});
				uni.navigateBack({delta: 1});
			}
		},
		methods: {
			submit: function() {
				if (this.reason === '') {
					return uni.showToast({title: '请填写退款理由', icon: 'none'});
				}
				
				this.loading = true
				this.$api.post('/order/'+this.orderid+'/apply_refund', {reason: this.reason}, {
					token: true,
					toast: false
				}).then(res => {
					this.loading = false
					uni.navigateBack({delta: 1});
					uni.showToast({title: '申请成功，等待商家审核', icon: "success"});
				}).catch(err => {
					this.loading = false
					uni.showToast({title: '申请失败，请重试', icon: 'none'});
				})
			}
		}
	}
</script>

<style>

</style>

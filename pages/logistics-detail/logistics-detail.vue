<template>
	<view>
		<view class="uni-timeline" style="padding: 30upx 40upx;background-color: #fff;">
			<view v-for="(item,index) in list" :key="index" class="uni-timeline-item"
			:class="{'uni-timeline-first-item':index===0, 'uni-timeline-last-item':index===list.length-1}">
				<view class="uni-timeline-item-divider"></view>
				<view class="uni-timeline-item-content">
					<view>{{ item.status }}</view>
					<view class="datetime">{{ item.time }}</view>
				</view>
			</view>
			
			<view v-if="list.length === 0" class="d-flex a-center j-center py-5">
				<text class="font-md text-light-muted">暂无物流信息</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				orderid: 0,
				list: []
			}
		},
		onLoad: function(e) {
			if (e.orderid) {
				this.orderid = e.orderid
				this.getShipInfo()
			} else {
				uni.showToast({title: '参数不完整', icon: 'none'});
				uni.navigateBack({delta: 1});
			}
		},
		methods: {
			getShipInfo: function() {
				let arr = {
					1:"在途中",
					2:"派件中",
					3:"已签收",
					4:"派送失败(拒签等)"
				}
				this.$api.get('/order/'+this.orderid+'/get_ship_info', {}, {token: true, toast: false}).then(res => {
					let status = arr[res.result.deliverystatus]
					if (status) {
						uni.setNavigationBarTitle({title: status})
					}
					this.list = res.result.list
				}).catch(err => {
					uni.showToast({title: '物流信息获取失败', icon: 'none'});
				})
			}
		}
	}
</script>

<style>

</style>

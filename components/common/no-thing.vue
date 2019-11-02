<template>
	<view class="position-absolute d-flex flex-column j-center a-center top-0 bottom-0 left-0 right-0"
	style="background-color: #F5F5F5;">
		<image :src="getIcon" mode="widthFix" style="width: 250upx;"></image>
		<view style="color: #B2B2B2;">{{ msg }}</view>
	</view>
</template>

<script>
	export default {
		props: {
			icon: {
				type: String,
				default: "no_comment"
			},
			msg: {
				type: String,
				default: "您还没有待付款订单"
			}
		},
		computed: {
			getIcon() {
				let icon = this.icon
				return `/static/images/nothing/${icon}.png`
			}
		}
	}
</script>

<style>
</style>

<template>
	<!-- 左边w:373 h:530 -->
	<!-- 右边w:375 h:264   边h:2 -->
	<view class="d-flex">
		<image :src="resdata[0].src"
		lazy-load
		style="width: 373upx; height: 530upx; border-right: 2upx solid #F5F5F5;"
		data-tag="big"
		@tap="event">
		</image>
		<view class="d-flex flex-column">
			<image :src="resdata[1].src"
			style="width: 375upx; height: 264upx; border-bottom: 2upx solid #F5F5F5;"
			data-tag="smalltop"
			@tap="event">
			</image>
			<image :src="resdata[2].src"
			style="width: 375upx; height: 264upx;"
			class="three-adv-smallbottom-image"
			data-tag="smallbottom"
			@tap="event">
			</image>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			resdata: Object
		},
		methods: {
			event: function(e) {
				console.log(e.mp.target.dataset.tag)
			}
		}
	}
</script>

<style>
	/* #ifdef MP-WEIXIN */
	.three-adv-smallbottom-image {
		margin-top: 2upx;
	}
	/* #endif */
</style>

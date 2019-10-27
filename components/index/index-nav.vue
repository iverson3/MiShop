<template>
	<view class="row j-center m-2">
		<block v-for="(item,index) in resdata" :key="index">
			<view class="span-4 d-flex flex-column j-center a-center py-2"
			@tap="event">
				<image :src="item.src" 
				style="width: 60upx; height: 60upx;"
				mode="widthFix"></image>
				<text class="font-sm">{{ item.text }}</text>
			</view>
		</block>
	</view>
</template>

<script>
	export default {
		props: {
			resdata: Array
		},
		methods: {
			event: function(e) {
				console.log("点击了分类图标", e)
			}
		}
	}
</script>

<style>
</style>

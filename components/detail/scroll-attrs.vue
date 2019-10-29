<template>
	<!-- 滚动商品特性
	每一项元素 w170 h110
	-->
	<scroll-view scroll-x class="scroll-row" >
		<view class="scroll-row-item" 
		v-for="(item,index) in baseAttrs"
		:key="index"
		style="width: 170upx;height: 110upx;">
			<view class="d-flex flex-column a-center j-center">
				<view class="iconfont icon-cpu line-h-sm"></view>
				<view class="line-h-sm">{{ item.title}}</view>
				<view class="text-light-muted font-sm line-h-sm">{{ item.desc }}</view>
			</view>
		</view>
	</scroll-view>
</template>

<script>
	export default {
		props:['baseAttrs']
	}
</script>

<style>
</style>

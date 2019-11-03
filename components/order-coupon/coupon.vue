<template>
	<view class="bg-white d-flex border rounded a-center border-light-secondary mb-3">
		<view class="flex-1 d-flex flex-column j-center pl-3">
			<view class="font-md" :class="item.disabled || !item.status? 'text-light-muted':''">{{ item.title }}</view>
			<view class="font text-light-muted">{{ item.start_time }}~{{ item.end_time }}</view>
		</view>
		<view class="text-white d-flex flex-column j-center a-center" 
		:class="item.disabled || !item.status? 'bg-secondary':'main-bg-color'"
		style="width: 220upx;height: 200upx;">
			<view class="font-lg line-h">{{ item.price }}<text class="font">元</text></view>
			<view class="font">{{ item.desc }}</view>
			<view class="rounded bg-white w-50 text-center mt-1" :class="item.disabled || !item.status? 'text-secondary':'main-text-color'" hover-class="bg-light">
				{{ item.status ? '去使用' : '已失效' }}
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			item: Object,
			index: Number
		}
	}
</script>

<style>
</style>

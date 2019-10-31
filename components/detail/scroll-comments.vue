<template>
	<!-- 横向滚动评论
	外层 w620 h380
	头像 w70 h70
	图片 h115
	-->
	<view class="p-2">
		<scroll-view scroll-x class="scroll-row">
			<view class="scroll-row-item rounded bg-light-secondary mr-2 p-2" 
			v-for="(item,index) in comments" 
			:key="index"
			style="width: 620upx;height: 380upx;">
				<view class="d-flex a-center mb-1">
					<image :src="item.userpic" mode="widthFix"
					class="rounded-circle" 
					style="width: 70upx;height: 70upx;"></image>
					<view class="ml-2">
						<text class="font-md line-h">{{ item.username }}</text>
						<text class="d-block font text-light-muted line-h">{{ item.create_time }}</text>
					</view>
					<view class="iconfont icon-dianzan font text-light-muted pl-1 ml-auto">{{ item.goods_num }}</view>
				</view>
				<view class="d-block font-md mb-2 pt line-h-sm" 
				style="min-height: 90upx;max-height: 104upx;white-space: initial;overflow: hidden;">
					{{ item.context }}
				</view>
				<view class="row">
					<view v-for="(img,i) in item.imglist" :key="i" class="span24-8 px-2">
						<image :src="img" mode="widthFix" class="rounded" style="height: 115upx;"></image>
					</view>
				</view>
			</view>
		</scroll-view>
		
		<navigator url="/pages/detail-comment/detail-comment">
			<view class="d-flex a-center j-center py-2 mt-2 text-primary" hover-class="bg-light-secondary">
				更多评论 <view class="iconfont icon-you"></view>
			</view>
		</navigator>
	</view>
</template>

<script>
	export default {
		props: ['comments']
	}
</script>

<style>
</style>

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
						<text class="d-block font text-light-muted line-h">{{ item.create_time | formatTime }}</text>
					</view>
					<view class="iconfont icon-dianzan font text-light-muted ml-auto">
						<text class="pl-1">{{ item.goods_num }}</text>
					</view>
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
		
		<!-- 暂无评论 -->
		<view v-if="!comments || comments.length === 0" class="w-100 py-3 d-flex a-center j-center font-md text-light-muted text-center bg-light-secondary">
			暂无评论
		</view>
		<view class="d-flex a-center j-center py-2 mt-2 text-primary" 
		v-if="comments && comments.length !== 0"
		@click="openCommentList"
		hover-class="bg-light-secondary">
			更多评论 <view class="iconfont icon-you"></view>
		</view>
	</view>
</template>

<script>
	import utils from '@/common/lib/utils.js';
	
	export default {
		props: ['comments', 'goods_id'],
		filters: {
			formatTime(value) {
				return utils.gettime(value)
			}
		},
		methods: {
			openCommentList: function() {
				uni.navigateTo({
					url: "/pages/detail-comment/detail-comment?id=" + this.goods_id
				})
			}
		}
	}
</script>

<style>
</style>

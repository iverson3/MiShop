<template>
	<view>
		<view class="p-2">
			<view class="d-flex a-center py-2 border-bottom border-light-secondary">
				<text class="text-muted">用户评价 (125)</text>
				<text class="main-text-color ml-auto mr-1">98.5%</text>
				<text class="text-muted">满意</text>
			</view>
			
			<view class="d-flex flex-wrap pt-2" style="margin-right: -20upx;">
				<view class="px-2 py border rounded mr-2 mb-2 cate-item" 
				v-for="(item,index) in cateList" 
				:class="cateIndex===index?'active':''"
				@tap="cateChange(index)"
				:key="index">
					{{ item.name }}
				</view>
			</view>
		</view>
		
		<divider></divider>
		
		<!-- 评论列表 -->
		<view class="d-flex p-2 a-start border-bottom border-light-secondary">
			<image src="/static/images/demo/demo6.jpg" mode="widthFix" class="rounded flex-shrink" style="width: 90upx;height: 90upx;"></image>
			<view class="pl-2 flex-1">
				<view class="d-flex a-center">
					<text class="font-md text-primary font-weight">昵称</text>
					<view class="iconfont icon-service main-text-color ml-auto">
						<text class="pl-1 font">超好</text>
					</view>
				</view>
				<view class="line-h-md font-md">
					非常好非常好非常好非常好,非常好非常好非常好非常好非常好非常好
				</view>
				<view class="row">
					<view class="span24-8 px pb">
						<image src="/static/images/demo/cate_08.png" mode="widthFix" style="height: 100upx;"></image>
					</view>
				</view>
				<view class="d-flex a-center">
					<text class="text-light-muted">2019-09-15</text>
					<view class="d-flex text-light-muted ml-auto a-center mr-2">
						0 <text class="iconfont icon-dianzan text-muted ml-1"></text>
					</view>
					<view class="d-flex text-light-muted a-center">
						19 <text class="iconfont icon-pinglun text-muted ml-1"></text>
					</view>
				</view>
				<!-- 客服回复 -->
				<view class="bg-light-secondary p-2 rounded d-flex flex-wrap a-center mt-1">
					<text class="main-text-color">官方回复：</text>
					回复内容，回复内容回复内容回复内容回复内容回复内容回复内容回复内容回复内容
					<view class="iconfont icon-dianzan text-light-muted line-h-md font ml-2">
						<text class="text-muted pl-1">赞客服 120</text>
					</view>
				</view>
			</view>
		</view>
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				cateIndex: 0,
				cateList: [
					{ name: "全部" },
					{ name: "有图" },
					{ name: "非常喜欢" },
					{ name: "拍照好" },
					{ name: "手感很棒" },
					{ name: "效果好" },
					{ name: "性能很强" }
				]
			}
		},
		methods: {
			cateChange: function(index) {
				this.cateIndex = index
			}
		}
	}
</script>

<style>
.cate-item {
	background: #FFEBEC;
	color: #7B6D6C;
	border-color: #F4E0E1;
}
.cate-item.active {
	background: #FF6B01!important;
	color: #FFFFFF!important;
	border-color: #DE7232!important;
}
</style>

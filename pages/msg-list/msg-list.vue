<template>
	<view class="p-2">
		<view v-for="(item,index) in list" :key="index" 
		@tap="openDetail(item)"
		class="mb-2 p-2 bg-white rounded" hover-class="bg-light-secondary">
			<view class="text-dark font-md">{{ item.title }}</view>
			<view class="font text-light-muted">{{ item.desc }}</view>
			<view class="font text-light-muted">{{ item.create_time }}</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				list: [
					{
						title: "uni-app第三季仿微信app开发正式开售啦",
						desc: "开启纯nvue原生渲染，大大提升性能",
						create_time: "9月份"
					},
					{
						title: "uni-app第三季仿微信app开发正式开售啦",
						desc: "开启纯nvue原生渲染，大大提升性能",
						create_time: "9月份"
					},
					{
						title: "uni-app第三季仿微信app开发正式开售啦",
						desc: "开启纯nvue原生渲染，大大提升性能",
						create_time: "9月份"
					},
					{
						title: "uni-app第三季仿微信app开发正式开售啦",
						desc: "开启纯nvue原生渲染，大大提升性能",
						create_time: "9月份"
					},
					{
						title: "uni-app第三季仿微信app开发正式开售啦",
						desc: "开启纯nvue原生渲染，大大提升性能",
						create_time: "9月份"
					}
				]
			}
		},
		methods: {
			openDetail: function(item) {
				uni.navigateTo({
					url: "/pages/msg-detail/msg-detail?detail=" + JSON.stringify(item)
				})
			}
		}
	}
</script>

<style>
page {
	background-color: #EEEEEE;
}
</style>

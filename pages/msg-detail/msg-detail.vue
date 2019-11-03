<template>
	<view>
		<!-- 标题 -->
		<view class="font-lg text-dark my-3 px-2 line-h-md">{{ detail.title }}</view>
		<!-- 内容 -->
		<view class="mt-4 px-2">
			<u-parse className="uparse" :content="detail.desc" @preview="preview" @navigate="navigate"></u-parse>
		</view>
	</view>
</template>

<script>
	import uParse from '@/components/uni-ui/uParse/src/wxParse.vue';
	
	export default {
		components: {
			uParse
		},
		data() {
			return {
				detail: {}
			}
		},
		onLoad: function(e) {
			if (!e.detail) {
				uni.navigateBack({delta: 1})
				return
			}
			this.detail = JSON.parse(e.detail)
			uni.setNavigationBarTitle({
				title: this.detail.title
			})
		},
		methods: {
			// 详情信息中的图片预览处理
			preview(src, e) {
				// do something
				console.log("src: " + src);
			},
			// 详情信息中的链接跳转处理
			navigate(href, e) {
				// 如允许点击超链接跳转，则应该打开一个新页面，并传入href，由新页面内嵌webview组件负责显示该链接内容
				console.log("href: " + href);
				// uni.showModal({
				// 	content : "点击链接为：" + href,
				// 	showCancel:false
				// })
			}
		}
	}
</script>

<style>
/* 解决uParse详情显示组件中图片边距和行高的问题 */
.uparse .p {padding: 0!important;}
.uparse view {line-height: 0!important;}
</style>

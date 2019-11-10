<template>
	<!-- 基础卡片组件 -->
	<view class="card" :style="cardStyle">
		<!-- head -->
		<view v-if="showhead" class="p-2 main-border-color d-flex a-center j-sb" :class="getHeadClass">
			<slot name="title">
				<text v-if="headTitle" class="font-md" :class="headTitleWeight?'font-weight':''">{{ headTitle }}</text>
			</slot>
			<slot name="right"></slot>
		</view>
		<!-- body -->
		<view :class="getBodyClass" :style="bodyStyle">
			<image v-if="bodyCover" :src="bodyCover" mode="widthFix"></image>
			<slot></slot>
		</view>
	</view>
	
	
	<!-- 调用方法举例 -->
	<!-- 普通调用 -->
	<!-- <card headTitle="每日精选" bodyCover="/static/images/demo/demo4.jpg"></card> -->
	
	<!-- 使用slot插槽 -->
	<!-- <card :showhead="false">
		<block slot="title">标题</block>
		<image src="/static/images/bg.jpg" mode="widthFix"></image>
	</card> -->
</template>

<script>
	export default {
		props: {
			bodyStyle: String,
			
			// 头部标题
			headTitle: String,
			// 主体封面图
			bodyCover: String,
			// 是否显示头部
			showhead: {
				type: Boolean,
				default: true
			},
			// 标题是否加粗
			headTitleWeight:{
				type: Boolean,
				default: true
			},
			// 是否显示下边线
			headBorderBottom:{
				type: Boolean,
				default: true
			},
			// 是否给body加padding
			bodyPadding:{
				type: Boolean,
				default: false
			},
			
			cardStyle: {
				type: String,
				default: ""
			}
		},
		computed: {
			getHeadClass() {
				let BorderBottom = this.headBorderBottom ? "border-bottom" : ""
				return `${BorderBottom}`
			},
			getBodyClass() {
				let bodyPadding = this.bodyPadding ? "p-2" : ""
				return `${bodyPadding}`
			}
		}
	}
</script>

<style>
</style>

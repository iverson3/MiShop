<template>
	<!-- 基础卡片组件 -->
	<view class="card">
		<!-- head -->
		<view v-if="showhead" class="p-2 border-bottom main-border-color">
			<slot name="title">
				<text v-if="headTitle" class="font-md font-weight">{{ headTitle }}</text>
			</slot>
		</view>
		<!-- body -->
		<view>
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
			// 头部标题
			headTitle: String,
			// 主体封面图
			bodyCover: String,
			// 是否显示头部
			showhead: {
				type: Boolean,
				default: true
			}
		}
	}
</script>

<style>
</style>

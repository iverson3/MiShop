<template>
	<view>
		<divider></divider>
		<card headTitle="申请售后的产品" cardStyle="background-color: #FFFFFF;">
			<view class="d-flex a-center px-3 py-2">
				<image src="/static/images/demo/cate_01.png" mode="widthFix" style="width: 100upx;height: 100upx;"></image>
				<view class="flex-1 ml-3">
					<view style="font-size: 34upx;">商品名称</view>
					<view class="font-md text-light-muted">维修服务：剩余120天</view>
				</view>
			</view>
		</card>
		<divider></divider>
		
		<card headTitle="服务类型" :bodyPadding="true" cardStyle="background-color: #FFFFFF;">
			<mi-radio-group :label="label" :selected.sync='label.selected'></mi-radio-group>
		</card>
		<divider></divider>
		
		<card headTitle="问题描述" :bodyPadding="true" cardStyle="background-color: #FFFFFF;">
			<view class="position-relative">
				<textarea placeholder="请详细描述一下你遇到的问题" :maxlength="maxlength"
				v-model="content"
				style="width: 100%; height: 400upx; box-sizing: border-box;"
				class="rounded border p-2" />
				<view class="position-absolute font text-light-muted" 
				style="bottom: 5upx;right: 10upx;">
					{{ remain }}/{{ maxlength }}
				</view>
			</view>
		</card>
		
		<view class="p-3">
			<view class="rounded main-bg-color text-white text-center font-md py-2" hover-class="main-bg-hover-color">
				下一步
			</view>
		</view>
	</view>
</template>

<script>
	import card from '@/components/common/card.vue';
	import miRadioGroup from '@/components/common/mi-radio-group.vue'
	
	export default {
		components: {
			card,
			miRadioGroup
		},
		data() {
			return {
				label: {
					selected: 0,
					list: [
						{name: '维修'}
					]
				},
				
				maxlength: 200,
				content: ""
			}
		},
		computed: {
			// 剩余的可输入字数
			remain() {
				return this.maxlength - this.content.length
			}
		},
		methods: {
			
		}
	}
</script>

<style>
page {
	background-color: #EEEEEE;
}
</style>

<template>
	<view>
		<view class="w-100 d-flex a-center border-bottom border-secondary py-2">
			<view class="iconfont icon-dingwei font-md pl-2"></view>
			<view class="font-md text-light-muted mr-2">当前定位城市</view>
			<view class="font-md main-text-color font-weight">深圳</view>
			<view class="ml-auto text-primary pr-3">重新定位</view>
		</view>
		
		<card headTitle="常用城市" :headBorderBottom="false" :headTitleWeight="false" @itemClicked="itemClickedHandler">
			<!-- 单选按钮组 -->
			<mi-radio-group :label="labelHistoryCity"></mi-radio-group>
		</card>
		
		<card headTitle="热门城市" :headBorderBottom="false" :headTitleWeight="false">
			<!-- 单选按钮组 -->
			<mi-radio-group :label="labelHotCity"></mi-radio-group>
		</card>
		
		<!-- 占位 -->
		<view class="w-100" style="height: 30upx;"></view>
		
		<!-- 城市列表 -->
		<lee-select :listData="listData" :navAttr="navAttr" @chooseItem="chooseItem"></lee-select>
	</view>
</template>

<script>
	import card from '@/components/common/card.vue';
	import miRadioGroup from '@/components/common/mi-radio-group.vue'
	import leeSelect from '@/components/common/lee-select/lee-select.vue'
	
	import city from '@/common/data/city.js'
	
	export default {
		components: {
			card,
			miRadioGroup,
			leeSelect
		},
		data() {
			return {
				labelHistoryCity: {
					selected: -1,
					oldSelected: -1,
					list: [
						{name: '武汉'},
						{name: '荆州'}
					]
				},
				labelHotCity: {
					selected: -1,
					oldSelected: -1,
					list: [
						{name: '北京'},
						{name: '上海'},
						{name: '广州'},
						{name: '深圳'},
						{name: '成都'},
						{name: '杭州'},
						{name: '武汉'},
						{name: '重庆'}
					]
				},
				
				listData: city,
				navAttr: {
					activeColor: 24,
					itemPadding: "3 0",
					padding: "0 4 0 4"
				}
			}
		},
		methods: {
			itemClickedHandler: function(item) {
				console.log(item.name);
			},
			
			chooseItem: function(name) {
				uni.$emit('updateIndexCity', name)
				uni.navigateBack({delta: 1})
			}
		}
	}
</script>

<style>

</style>

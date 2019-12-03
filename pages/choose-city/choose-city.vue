<template>
	<view style="height: 100%;">
		<!-- 城市列表 -->
		<lee-select :listData="listData" :navAttr="navAttr" @chooseItem="chooseItem">
			
			<view class="w-100 d-flex a-center border-bottom border-secondary py-2">
				<view class="iconfont icon-dingwei font-md pl-2"></view>
				<view class="font-md text-light-muted mr-2">当前定位城市</view>
				<view class="font-md main-text-color font-weight" @tap="chooseItem(curCity)">{{ curCity }}</view>
				<view class="ml-auto text-primary pr-3" @tap="fetchLocation">重新定位</view>
			</view>
			
			<card headTitle="常用城市" :headBorderBottom="false" :headTitleWeight="false">
				<!-- 单选按钮组 -->
				<mi-radio-group :label="labelHistoryCity" @itemClicked="itemClickedHandler"></mi-radio-group>
			</card>
				
			<card headTitle="热门城市" :headBorderBottom="false" :headTitleWeight="false">
				<!-- 单选按钮组 -->
				<mi-radio-group :label="labelHotCity" @itemClicked="itemClickedHandler"></mi-radio-group>
			</card>
				
			<!-- 占位 -->
			<view class="w-100" style="height: 30upx;"></view>
			
		</lee-select>
	</view>
</template>

<script>
	import card from '@/components/common/card.vue';
	import miRadioGroup from '@/components/common/mi-radio-group.vue'
	import leeSelect from '@/components/common/lee-select/lee-select.vue'
	// 城市数据
	import city from '@/common/data/city.js'
	
	export default {
		components: {
			card,
			miRadioGroup,
			leeSelect
		},
		data() {
			return {
				curCity: "北京",
				
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
					activeColor: "#FD6801",
					backgroundColor: "rgba(0, 0, 0, 0.2)",
					itemPadding: "3 0",
					padding: "0 10 0 10"
				}
			}
		},
		created: function() {
			this.fetchLocation()
		},
		methods: {
			fetchLocation: function() {
				uni.showLoading({title: "获取定位中...", mask: true})
				this.curCity = "定位中..."
				uni.getLocation({
					geocode: true,
					success: (res) => {
						uni.hideLoading()
						if (res.address && res.address.city) {
							this.curCity = res.address.city
						} else {
							this.curCity = "定位失败"
							uni.showToast({title: '获取定位失败', icon: 'none'});
						}
					},
					fail: () => {
						uni.hideLoading()
						this.curCity = "定位失败"
						uni.showToast({title: '获取定位失败', icon: 'none'});
					}
				})
			},
			itemClickedHandler: function(item) {
				this.chooseItem(item.name)
			},
			chooseItem: function(name) {
				// 去除城市名中的最后一个"市"字
				let i = name.indexOf('市')
				if (i !== -1 && i === name.length - 1) name = name.replace("市", "")
				// 通知首页更新city信息
				uni.$emit('updateIndexCity', name)
				uni.navigateBack({delta: 1})
			}
		}
	}
</script>

<style>

</style>

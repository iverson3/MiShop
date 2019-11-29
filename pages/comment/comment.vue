<template>
	<view>
		<text class="d-flex a-center j-center text-center font-lg text-light-muted">{{ location }}</text>
		
		<view>
			<map v-if="showMap" :latitude="latitude" :longitude="longitude" :scale="18" 
			:markers="covers" :circles="circles" :show-location="true"
			style="width: 750upx; height: 800upx;">
				
				<cover-view class="mt-2 ml-2 bg-light-secondary border text-center font-md text-danger" style="height: 80upx; width: 250upx;">
					提示信息
				</cover-view>
				<cover-image class="mt-2 ml-2" @click="IconClick" src="../../static/tabbar/cart.png" style="width: 50upx;height: 50upx;"></cover-image>
				
			</map>
		</view>
		<view class="mt-2 w-100 d-flex a-center j-center">
			<view class="w-50 h-100 p-2 text-center" @click="openLocation">打开地图，查看位置</view>
			<view class="w-50 h-100 p-2 text-center" @click="chooseLocation">打开地图，选择位置</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				showMap: false,
				latitude: 0,
				longitude: 0,
				
				name: "",
				city: "",
				location: "订单评价",
				
				covers: [
					{
						id: 5,
						title: '',
						latitude: 0,
						longitude: 0,
						iconPath: '/static/images/indexnav/4.gif',
						// width: '',
						// height: ''
					}
				],
				circles: [
					{
						latitude: 0,
						longitude: 0,
						radius: 100,
						strokeWidth: 2,
						color: "#428BCA88",
						fillColor: "#B6E1F248",
					}
				]
			}
		},
		onLoad: function() {
			uni.$on('openLocationFromNvue', (data) => {
				this.chooseLocation()
			})
			
			// 获取当前定位
			// #ifdef APP-PLUS
			uni.getLocation({
				geocode: true,
				success: res => {
					console.log(res);
					res = res.address
					this.name = res.street + ' ' + res.streetNum
					this.city = res.city
					this.covers[0].title = res.street + ' ' + res.streetNum
					this.location = res.province + ' ' + res.city + ' ' + res.district + ' ' + res.street + ' ' + res.streetNum
				},
				fail: () => {
					this.location = "获取定位失败"
					uni.showToast({
						title: '获取定位失败',
						icon: 'none'
					});
				}
			});
			// 获取可用于地图显示的经纬度坐标
			uni.getLocation({
				type: 'gcj02',
				success: res => {
					console.log(res);
					this.latitude = res.latitude
					this.longitude = res.longitude
					this.covers[0].latitude = res.latitude
					this.covers[0].longitude = res.longitude
					this.circles[0].latitude = res.latitude
					this.circles[0].longitude = res.longitude
					this.showMap = true
					
					// 引入SubNVue原生子窗体 (可覆盖普通组件无法覆盖的map video等原生组件)
					// uni-app有提供cover-view cover-image两个特殊组件专门用来覆盖map video等原生组件
					// 但cover-view里面无法嵌套其他组件，能实现的需求很有限； 所以选择使用SubNVue原生子窗体
					const mapSearchBar = uni.getSubNVueById('mapsearchbar')
					mapSearchBar.show('fade-in', 250)
					// 通知SubNVue原生子窗体进行数据更新或操作
					uni.$emit('setSearchBarInfo', {
						city: this.city,
						location: this.location
					})
				},
				fail: () => {
					console.log('获取定位失败');
				}
			});
			// #endif
			// #ifndef APP-PLUS
			uni.getLocation({
				type: 'wgs84', // 默认为 wgs84 返回 gps 坐标，gcj02 返回国测局坐标
				success: res => {},
				fail: () => {}
			});
			// #endif
		},
		onUnload: function() {
			uni.$off('openLocationFromNvue')
		},
		methods: {
			IconClick: function() {
				uni.showToast({
					title: '点击操作',
					icon: "none"
				});
			},
			openLocation: function() {
				uni.openLocation({
					longitude: Number(this.longitude),
					latitude: Number(this.latitude),
					name: this.name,
					address: this.location
				})
			},
			chooseLocation: function() {
				uni.chooseLocation({
					success: (res) => {
						this.longitude = res.longitude
						this.latitude = res.latitude
						this.name = res.name
						this.location = res.address
						
						this.covers[0].title = res.name
						this.covers[0].latitude = res.latitude
						this.covers[0].longitude = res.longitude
						this.circles[0].latitude = res.latitude
						this.circles[0].longitude = res.longitude
						
						uni.$emit('setSearchBarInfo', {
							city: res.name,
							location: this.location
						})
					}
				})
			}
		}
	}
</script>

<style>

</style>

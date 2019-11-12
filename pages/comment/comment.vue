<template>
	<view>
		<text class="d-flex a-center j-center text-center font-lg text-light-muted">{{ location }}</text>
		
		
		<view>
			<map v-if="showMap" :latitude="latitude" :longitude="longitude" :scale="18" 
			:markers="covers" :circles="circles"
			style="width: 750upx; height: 800upx;"></map>
		</view>x
	</view>
</template>

<script>
	export default {
		data() {
			return {
				showMap: false,
				latitude: 0,
				longitude: 0,
				
				location: "订单评价",
				
				covers: [
					{
						id: 5,
						title: '公司',
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
			// 获取当前定位
			// #ifdef APP-PLUS
			uni.getLocation({
				geocode: true,
				success: res => {
					console.log(res);
					res = res.address
					this.location = res.province + ' ' + res.city + ' ' + res.district + ' ' + res.street + ' ' + res.streetNum
				},
				fail: () => {
					this.location = "获取定位失败"
					console.log('获取定位失败');
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
		methods: {
			
		}
	}
</script>

<style>

</style>

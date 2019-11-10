<template>
	<view>
		<swiper :style="getStyle" indicator-dots autoplay :interval="3000" :duration="200" circular>
			<block v-for="(item,index) in resdata" :key="index">
				<swiper-item>
					<view class="swiper-item" @tap="event(item, index)">
						<image :src="item.src" 
						lazy-load 
						:style="getStyle"></image>
					</view>
				</swiper-item>
			</block>
		</swiper>
	</view>
</template>

<script>
	export default {
		props: {
			resdata: [Array, Object],
			height: {
				type: String,
				default: "350" 
			},
			preview: {
				type: Boolean,
				default: false 
			},
		},
		computed: {
			getStyle() {
				// 这里是动态的绑定，不能使用单位upx 可以用rpx代替
				return `height: ${this.height}rpx;`
			},
			getUrls() {
				// 从图片组数据中提取出图片地址组装成图片预览所需要的数据格式
				// return this.resdata.map((v) => v.src)
				let arr = []
				for (let v in this.resdata) {
					arr.push(this.resdata[v].src)
				}
				return arr
			}
		},
		onReady:function(){
			
		},
		methods: {
			event: function(item, index) {
				console.log("点击了轮播图", item)
				if (this.preview) {
					uni.previewImage({
						current: index, 
					    urls: this.getUrls,
						indicator: "default"
					})
				}
			}
		}
	}
</script>

<style>
</style>

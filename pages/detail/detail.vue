<template>
	<view>
		
		<!-- 商品详情大图 -->
		<swiper-image :resdata="banners" :height="750" :preview="true"></swiper-image>
		
		<!-- 商品基础信息 -->
		
	</view>
</template>

<script>
	import swiperImage from '@/components/index/swiper-image.vue'
	
	export default {
		components: {
			swiperImage
		},
		data() {
			return {
				banners: [
					{ src: "/static/images/demo/demo9.jpg" },
					{ src: "/static/images/demo/demo10.jpg" }
				]
			}
		},
		methods: {
			
		}
	}
</script>

<style>

</style>

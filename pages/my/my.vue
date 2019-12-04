<template>
	<view>
		<!-- 头部 -->
		<view class="position-relative d-flex a-center" style="height: 320upx;">
			<view @click="navigate('msg-list')" class="iconfont icon-xiaoxi position-absolute text-white"
			style="font-size: 50upx;top: 75upx;right: 20upx;z-index: 100;"></view>
			<image src="/static/images/bg.jpg" style="width: 100%;height: 320upx;"></image>
			
			<view class="d-flex a-center position-absolute left-0 right-0" style="bottom: 50upx;">
				<image :src="loginStatus? userInfo.avatar : '/static/images/demo/demo6.jpg'" 
				class="rounded-circle border-light ml-4" 
				style="width: 145upx;height: 145upx;border: 5upx solid;"></image>
				<view @tap="openLogin" class="ml-2 text-white font-md">
					{{ loginStatus? userInfo.nickname : '登录/注册'}}
				</view>
				<view class="d-flex a-center j-center ml-auto a-self-end px-2" 
				style="height: 70upx;background: #FFD43F;color: #CC4A00;border-top-left-radius: 35upx;border-bottom-left-radius: 35upx;">
					<view class="iconfont icon-huangguan line-h mr-2"></view>
					会员积分 {{ loginStatus? '12.99' : '0.00'}}
				</view>
			</view>
		</view>
		
		<!-- 图标分类 -->
		<card>
			<view slot="title" class="d-flex a-center">
				<text class="font-md font-weight">我的订单</text>
			</view>
			<view slot="right" class="d-flex a-center text-secondary font" @tap="navigate('order')">
				全部订单 <text class="iconfont icon-you font"></text>
			</view>
			<!-- 默认插槽 -->
			<view class="d-flex a-center">
				<view class="flex-1 d-flex flex-column a-center j-center py-3" 
				v-for="(item,index) in orderStatus" :key="index"
				@tap="openOrderList(item.tabIndex)"
				hover-class="bg-light-secondary">
					<view class="iconfont font-lg line-h" :class="item.icon"></view>
					<view>{{ item.title }}</view>
				</view>
			</view>
		</card>
		
		<divider></divider>
		
		<!-- 功能列表 -->
		<uni-list-item title="小米会员" :showExtraIcon="true" leftIcon="icon-VIP" leftIconStyle="color:#FDBF2E;"></uni-list-item>
		<uni-list-item title="会员中心" :showExtraIcon="true" leftIcon="icon-huangguan" leftIconStyle="color:#FCBE2D;"></uni-list-item>
		<uni-list-item title="服务中心" :showExtraIcon="true" leftIcon="icon-service" leftIconStyle="color:#FA6C5E;"></uni-list-item>
		<uni-list-item title="小米之家" @click="navigate('video-demo')" :showExtraIcon="true" leftIcon="icon-home" leftIconStyle="color:#FE8B42;"></uni-list-item>
		<uni-list-item title="更多功能" @click="navigate('comment')" :showExtraIcon="true" leftIcon="icon-gengduo" leftIconStyle="color:#9ED45A;"></uni-list-item>
		<divider></divider>
		<uni-list-item title="我的收藏" @click="navigate('collection')" :showExtraIcon="true" leftIcon="icon-shoucang" leftIconStyle="color:#808C98;"></uni-list-item>
		<uni-list-item title="浏览历史" :showExtraIcon="true" leftIcon="icon-history" leftIconStyle="color:#808C98;"></uni-list-item>
		<uni-list-item title="更多设置" @click="navigate('user-set', false)" :showExtraIcon="true" leftIcon="icon-icon_set_up" leftIconStyle="color:#808C98;"></uni-list-item>
		
		<!-- 占位 -->
		<view :style="'height: '+ bottomHeight +'upx;background: white;'"></view>
	</view>
</template>

<script>
	import card from '@/components/common/card.vue'
	import uniListItem from '@/components/uni-ui/uni-list-item/uni-list-item.vue'
	
	import {mapState} from 'vuex';
	export default {
		components: {
			card,
			uniListItem
		},
		data() {
			return {
				orderStatus: [
					{
						title: "待付款",
						icon: "icon-daifukuan",
						tabIndex: 1
					},
					{
						title: "待发货",
						icon: "icon-daifahuo",
						tabIndex: 2
					},
					{
						title: "待收货",
						icon: "icon-daishouhuo",
						tabIndex: 3
					},
					{
						title: "待评价",
						icon: "icon-daipingjia",
						tabIndex: 4
					}
				],
				// 底部tabBar的高度 (H5平台下底部tabBar因为不是原生控件 是div模拟的，所以会占用页面高度50px)
				bottomHeight: 0,
			}
		},
		computed: {
			...mapState({
				loginStatus: state => state.user.loginStatus,
				userInfo: state => state.user.userInfo
			})
		},
		// 分享
		onShareAppMessage: function(e) {
			console.log(e);
			return {
				title: "miShop用户个人页面",
				content: "miShop xxx用户个人中心页面",
				path: "/pages/my/my?screen=" + 333,
				imageUrl: "/static/images/demo/demo6.jpg",
				success: () => {
					console.log('Share success');
				},
				fail: () => {
					console.log('Share fail');
				}
			}
		},
		onLoad: function(e) {
			// 在H5(浏览器)平台下 因为没有原生控件这个概念，所以H5平台上的底部tabBar是uni-app用div构建模拟出来的
			// 所以在使用fixed绝对定位时，要考虑底部tabBar所占的50px的高度 (App和小程序平台下没有这个问题)
			// #ifdef H5
			this.bottomHeight = 100
			// #endif
			
			// 如果有自定义的screen参数 则表示是来自于分享
			if (e.screen) {
				uni.showToast({
					title: "分享场景值：" + e.screen,
					icon: 'none'
				});
			}
			
			// 如果是微信小程序平台 则提供分享按钮让用户进行分享操作
			// #ifdef MP-WEIXIN
			uni.showShareMenu({
				title: "share-title333",
				content: "share-content333",
				path: "/pages/my/my",
				success: () => {
					console.log('showShareMenu success');
				}
			})
			// #endif
		},
		methods: {
			navigate: function(path, check = true) {
				if (!path) return
				// 是否需要进行登录权限的检查
				if (check) {
					this.navigateTo({
						url: `/pages/${path}/${path}`
					})
					return
				}
				uni.navigateTo({
					url: `/pages/${path}/${path}`
				})
			},
			openLogin: function() {
				if (this.loginStatus) return
				uni.navigateTo({
					url: "/pages/login/login"
				})
			},
			openOrderList: function(tab) {
				this.navigateTo({
					url: "/pages/order/order?tab=" + tab
				})
			}
		}
	}
</script>

<style>

</style>

<template>
	<view>
		<!-- 头部 -->
		<view class="position-relative d-flex a-center" style="height: 320upx;">
			<navigator url="/pages/msg-list/msg-list">
				<view class="iconfont icon-xiaoxi position-absolute text-white"
				style="font-size: 50upx;top: 75upx;right: 20upx;z-index: 100;"></view>
			</navigator>
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
		<uni-list-item title="小米之家" :showExtraIcon="true" leftIcon="icon-home" leftIconStyle="color:#FE8B42;"></uni-list-item>
		<uni-list-item title="更多功能" :showExtraIcon="true" leftIcon="icon-gengduo" leftIconStyle="color:#9ED45A;"></uni-list-item>
		<divider></divider>
		<uni-list-item title="我的收藏" @click="navigate('collection')" :showExtraIcon="true" leftIcon="icon-shoucang" leftIconStyle="color:#808C98;"></uni-list-item>
		<uni-list-item title="浏览历史" :showExtraIcon="true" leftIcon="icon-history" leftIconStyle="color:#808C98;"></uni-list-item>
		<uni-list-item title="更多设置" @click="navigate('user-set')" :showExtraIcon="true" leftIcon="icon-icon_set_up" leftIconStyle="color:#808C98;"></uni-list-item>
		
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
				]
			}
		},
		computed: {
			...mapState({
				loginStatus: state => state.user.loginStatus,
				userInfo: state => state.user.userInfo
			})
		},
		methods: {
			navigate: function(path) {
				if (!path) return
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
				uni.navigateTo({
					url: "/pages/order/order?tab=" + tab
				})
			}
		}
	}
</script>

<style>

</style>

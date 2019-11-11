<template>
	<view>
		<card v-if="loginStatus" headTitle="账号管理" bodyStyle="background: #FFFFFF;">
			<uni-list-item title="个人资料" @click="navigate('user-userinfo')"></uni-list-item>
			<uni-list-item title="收货地址" @click="navigate('user-path-list')"></uni-list-item>
		</card>
		
		<card headTitle="关于" bodyStyle="background: #FFFFFF;">
			<uni-list-item v-for="(item,index) in list" :key="index" :title="item.title" @click="navigate(item.path)"></uni-list-item>
		</card>
		
		<view v-if="loginStatus" class="p-3">
			<button @click="doLogout" type="default" class="bg-white">退出登录</button>
		</view>
	</view>
</template>

<script>
	import card from '@/components/common/card.vue'
	import uniListItem from '@/components/uni-ui/uni-list-item/uni-list-item.vue'
	
	import {mapState, mapMutations} from 'vuex'
	export default {
		components: {
			card,
			uniListItem
		},
		data() {
			return {
				list: [
					{ title: "关于商城", path: "about" },
					{ title: "意见反馈", path: "" },
					{ title: "协议规则", path: "" },
					{ title: "资质证件", path: "" },
					{ title: "用户协议", path: "" },
					{ title: "隐私政策", path: "" }
				]
			}
		},
		computed: {
			...mapState({
				loginStatus: state => state.user.loginStatus
			})
		},
		methods: {
			...mapMutations(['logout', 'hideCartData', 'hideOrderData']),
			
			navigate: function(path) {
				if (!path) return
				uni.navigateTo({
					url: `/pages/${path}/${path}`
				})
			},
			doLogout: function() {
				this.$api.post('/logout', {}, {token: true, checkToken: true}).then(res => {
					this.logout()
					this.hideCartData()
					this.hideOrderData()
					
					uni.showToast({title: '退出登录成功', icon: 'none'});
					setTimeout(() => {
						uni.navigateBack({delta: 1})
					}, 500)
				}).catch(err => {
					// 请求失败之后的处理
					console.log(err);
				})
			}
		}
	}
</script>

<style>
page {
	background: #EEEEEE;
}
</style>

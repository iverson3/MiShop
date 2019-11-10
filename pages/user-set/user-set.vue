<template>
	<view>
		
		<card v-for="(item,index) in list" :key="index" :headTitle="item.label" bodyStyle="background: #FFFFFF;">
			<uni-list-item v-for="(v,i) in item.value" :key="i" :title="v.title" @click="navigate(v.path)"></uni-list-item>
		</card>
		
		<view class="p-3">
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
					{
						label: "账号管理",
						value: [
							{ title: "个人资料", path: "user-userinfo" },
							{ title: "收货地址", path: "user-path-list" }
						]
					},
					{
						label: "关于",
						value: [
							{ title: "关于商城", path: "about" },
							{ title: "意见反馈", path: "" },
							{ title: "协议规则", path: "" },
							{ title: "资质证件", path: "" },
							{ title: "用户协议", path: "" },
							{ title: "隐私政策", path: "" }
						]
					}
				]
			}
		},
		computed: {
			...mapState({
				token: state => state.user.token
			})
		},
		methods: {
			...mapMutations(['logout']),
			
			navigate: function(path) {
				if (!path) return
				uni.navigateTo({
					url: `/pages/${path}/${path}`
				})
			},
			doLogout: function() {
				let options = {
					header: {
						token: this.token
					}
				}
				this.$api.post('/logout', {}, options).then(res => {
					this.logout()
					uni.showToast({title: '退出登录成功', icon: 'none'});
					setTimeout(() => {
						uni.navigateBack({delta: 1})
					}, 500)
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

<template>
	<view>
		<divider></divider>
		<uni-list-item title="头像">
			<block slot="rightContent">
				<image :src="userInfo.avatar? userInfo.avatar : '/static/images/demo/demo6.jpg'" 
				style="width: 90upx;height: 90upx;"
				class="rounded-circle border border-light"></image>
			</block>
		</uni-list-item>
		<uni-list-item title="昵称">
			<block slot="rightContent">
				<text>{{ userInfo.nickname }}</text>
			</block>
		</uni-list-item>
		<uni-list-item title="性别">
			<block slot="rightContent">
				<text>{{ userInfo.sex || '未知' }}</text>
			</block>
		</uni-list-item>
		<uni-list-item title="生日" extraWidth="40%">
			<block slot="rightContent">
				<text>{{ userInfo.birthday || '2019-11-11' }}</text>
			</block>
		</uni-list-item>
		
		<divider></divider>
		<uni-list-item title="修改密码"></uni-list-item>
		<uni-list-item title="密保手机">
			<block slot="rightContent">
				<text>{{ userInfo.phone || '' }}</text>
			</block>
		</uni-list-item>
	</view>
</template>

<script>
	import uniListItem from '@/components/uni-ui/uni-list-item/uni-list-item.vue'
	
	import {mapState} from 'vuex'
	export default {
		components: {
			uniListItem
		},
		data() {
			return {
				
			}
		},
		computed: {
			...mapState({
				userInfo: state => state.user.userInfo
			})
		},
		methods: {
			
		}
	}
</script>

<style>

</style>

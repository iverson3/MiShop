<template>
	<view>
		<!-- 自定义导航条 -->
		<uni-nav-bar left-icon="back" 
		@click-left="clickLeft"
		@click-right="clickRight"
		right-text="忘记密码" title="登录" 
		:border="false" :shadow="false" :statusBar="true">
		</uni-nav-bar>
		
		<view class="p-5">
			<view class="font-big mb-5">密码登录</view>
			<input type="text" placeholder="请输入手机号/邮箱/账号" 
			v-model="username"
			@focus="focus('username')" @blur="blur('username')"
			:class="focusClass.username?'input-border-color':''"
			class="uni-input border-bottom mb-4 px-0" 
			placeholder-class="text-light-muted" />
			<input type="text" placeholder="请输入密码" 
			v-model="password"
			@focus="focus('password')" @blur="blur('password')"
			:class="focusClass.password?'input-border-color':''"
			class="uni-input border-bottom mb-4 px-0" 
			placeholder-class="text-light-muted" />
			<view class="py-2 w-100 d-flex j-center a-center main-bg-color rounded text-white font-md mb-4" 
			@tap="submit"
			hover-class="main-bg-hover-color">
				登录
			</view>
			<label @click="check = !check" class="checkbox d-flex a-center">
				<checkbox :value="check" :checked="check" />
				<text class="text-light-muted font-md">已阅读并同意xxx协议</text>
			</label>
		</view>
	</view>
</template>

<script>
	import uniNavBar from '@/components/uni-ui/uni-nav-bar/uni-nav-bar.vue'
	
	import {mapState, mapMutations, mapActions} from 'vuex';
	export default {
		components: {
			uniNavBar
		},
		data() {
			return {
				username: "",
				password: "",
				check: false,
				
				// 表单验证规则和提示信息
				rules: {
					username: [
						{
							rule: /^[a-zA-Z0-9_-]{5,17}$/,
							msg: "用户名格式不正确"
						},
						// {
						// 	rule: /^1[3456789]\d{9}$/,
						// 	msg: "用户名格式不正确"
						// }
					],
					password: [
						{
							rule: /^.{5,20}$/,
							msg: "密码长度不正确"
						}
					]
				},
				
				focusClass: {
					username: false,
					password: false
				}
			}
		},
		computed: {
			
		},
		methods: {
			...mapMutations(['login', 'initCartData', 'initOrderData']),
			...mapActions(['fetchPathData']),
			
			clickLeft: function() {
				uni.navigateBack({delta: 1})
			},
			clickRight: function() {
				console.log('忘记密码')
			},
			
			focus: function(key) {
				this.focusClass[key] = true
			},
			blur: function(key) {
				this.focusClass[key] = false
			},
			
			// 表单验证
			validate: function(key) {
				let check = true
				this.rules[key].forEach(v => {
					if (!v.rule.test(this[key])) {
						uni.showToast({title: v.msg, icon: 'none'})
						check = false
						return false
					}
				})
				return check
			},
			submit: function() {
				if (!this.check) {
					uni.showToast({title: "请先阅读并同意xxx协议", icon: 'none'})
					return
				}
				if (!this.validate('username')) return
				if (!this.validate('password')) return
				
				uni.showLoading({title: "登录中...", mask: true})
				// 请求服务器端 进行登录处理
				this.$api.post('/login', {
					username: this.username,
					password: this.password
				}).then(res => {
					console.log(res);
					this.login(res)
					// 登录成功之后初始化购物车数据、订单数据、收货地址数据
					// this.initCartData()
					this.initOrderData()
					this.fetchPathData()
					// 通知购物车进行更新
					// 没效果
					// this.$emit('updateCart')
					
					uni.hideLoading()
					uni.showToast({
						title: "登录成功",
						icon: "success"
					})
					setTimeout(() => {
						uni.navigateBack({delta: 1})
					}, 1000)
				})
				
			}
		}
	}
</script>

<style>

</style>

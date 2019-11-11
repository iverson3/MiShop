export default {
	state: {
		loginStatus: false,
		token: null,
		userInfo: {}
	},
	getters: {
		
	},
	mutations: {
		// 初始化用户登录状态
		initUserStatus(state) {
			let loginStatus = uni.getStorageSync('loginStatus')
			let token = uni.getStorageSync('token')
			let userInfo = uni.getStorageSync('userInfo')
			
			state.loginStatus = loginStatus || false
			state.token = token || null
			state.userInfo = userInfo? JSON.parse(userInfo) : {}
		},
		
		login(state, userinfo) {
			state.loginStatus = true
			state.token = userinfo.token
			delete userinfo.token
			state.userInfo = userinfo
			// 持久化存储
			uni.setStorageSync('loginStatus', state.loginStatus)
			uni.setStorageSync('token', state.token)
			uni.setStorageSync('userInfo', JSON.stringify(state.userInfo))
		},
		logout(state) {
			state.loginStatus = false
			state.token = null
			state.userInfo = {}
			uni.removeStorageSync('loginStatus')
			uni.removeStorageSync('token')
			uni.removeStorageSync('userInfo')
		}
	},
	actions: {
		refreshToken({commit, state}, obj) {
			setInterval(() => {
				// 请求服务器接口 重新获取token
				let token = "new-token"
				commit('resetToken', token)
				console.log(state.token)
			}, 2000)
		}
	}
}
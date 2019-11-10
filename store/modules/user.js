let loginStatus = uni.getStorageSync('loginStatus')
let token = uni.getStorageSync('token')
let userInfo = uni.getStorageSync('userInfo')

loginStatus = loginStatus? JSON.parse(loginStatus) : false
token = token? JSON.parse(token) : null
userInfo = userInfo? JSON.parse(userInfo) : {}

export default {
	state: {
		loginStatus: loginStatus,
		token: token,
		userInfo: userInfo
	},
	getters: {
		
	},
	mutations: {
		login(state, userinfo) {
			state.loginStatus = true
			state.token = userinfo.token
			delete userinfo.token
			state.userInfo = userinfo
			// 持久化存储
			uni.setStorageSync('loginStatus', JSON.stringify(state.loginStatus))
			uni.setStorageSync('token', JSON.stringify(state.token))
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
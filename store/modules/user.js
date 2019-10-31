export default {
	state: {
		token: "",
		userinfo: {}
	},
	getters: {
		getUserinfo: (state) => {
			return userinfo
		}
	},
	mutations: {
		resetToken(state, token) {
			state.token = token
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
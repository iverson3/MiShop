/*
{
	id: 2,
	name: "Stefan",
	phone: "13396095889",
	path: "广东省 深圳市 南山区",
	detailPath: "xxxx公司 2栋 122",
	isdefault: true
}
*/

export default {
	state: {
		list: [],
	},
	getters: {
		// 获取默认收货地址
		defaultPath: (state) => {
			return state.list.filter(v => {
				return v.isdefault
			})
		},
		// 获取默认地址中的城市部分
		defaultPathCity: (state, getters) => {
			let city = "北京 东城区"
			if (getters.defaultPath.length > 0) {
				city = getters.defaultPath[0].path
			}
			return city
		},
		getPathById: (state) => (id) => {
			let res = state.list.find(v => v.id === id)
			return res
		}
	},
	mutations: {
		// 初始化收货地址数据
		initPathData(state) {
			let pathList = uni.getStorageSync('pathList')
			state.list = pathList? JSON.parse(pathList) : []
		},
		// 用户退出登录之后隐藏收货地址数据
		hidePathData(state) {
			state.list = []
		},
		
		// 添加收货地址
		createPath(state, item) {
			state.list.unshift(item)
		},
		// 删除收货地址
		delPath(state, index) {
			state.list.splice(index, 1)
			// 收货地址有改动 持久化数据
			uni.setStorageSync('pathList', JSON.stringify(state.list))
		},
		// 修改收货地址
		updatePath(state, {index, item}) {
			for (let key in item) {
				state.list[index][key] = item[key]
			}
			// 这种修改方式无效
			// state.list[index] = item
		},
		// 取消默认收货地址
		removeDefault(state) {
			state.list.forEach(v => {
				if (v.isdefault) {
					v.isdefault = false
				}
			})
		}
	},
	actions: {
		// 新增收货地址
		createPathAction({commit, state}, item) {
			if (item.isdefault) {
				commit('removeDefault')
			}
			commit('createPath', item)
			// 收货地址有改动 持久化数据
			uni.setStorageSync('pathList', JSON.stringify(state.list))
		},
		// 修改收货地址
		updatePathAction({commit}, obj) {
			if (obj.item.isdefault) {
				commit('removeDefault')
			}
			commit('updatePath', obj)
			// 收货地址有改动 持久化数据
			uni.setStorageSync('pathList', JSON.stringify(state.list))
		}
	}
}
export default {
	state: {
		list: [
			{
				name: "张三",
				phone: "13396095889",
				path: "广东省 深圳市 南山区",
				detailPath: "xxxx街道",
				isdefault: false
			}
		],
	},
	getters: {
		// 获取默认收货地址
		defaultPath: (state) => {
			return state.list.filter(v => {
				return v.isdefault
			})
		}
	},
	mutations: {
		// 添加收货地址
		createPath(state, item) {
			state.list.unshift(item)
		},
		// 删除收货地址
		delPath(state, index) {
			state.list.splice(index, 1)
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
		createPathAction({commit}, item) {
			if (item.isdefault) {
				commit('removeDefault')
			}
			commit('createPath', item)
		},
		// 修改收货地址
		updatePathAction({commit}, obj) {
			if (obj.item.isdefault) {
				commit('removeDefault')
			}
			commit('updatePath', obj)
		}
	}
}
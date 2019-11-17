/*
{
	"id": 11,
	"user_id": 3,
	"province": "辽宁省",
	"city": "沈阳市",
	"district": "皇姑区",
	"address": "Dddhhhh ",
	"zip": 0,
	"name": "Zzzs",
	"phone": "13396097889",
	"last_used_time": 1573831386,
	"create_time": "1970-01-01 08:33:39",
	"update_time": "1970-01-01 08:33:39",
	isdefault: true
}
*/
import $api from '@/common/lib/request.js';

export default {
	state: {
		list: [],
		// 因为用户的收货地址基本上都不会有太多条,一次性就可以全部获取到,所以暂时不考虑下一页的问题
		page: 1
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
			let city = "北京市 东城区"
			if (getters.defaultPath.length > 0) {
				let item = getters.defaultPath[0]
				city = item.province +' '+ item.city +' '+ item.district
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
			// let pathList = uni.getStorageSync('pathList')
			// state.list = pathList? JSON.parse(pathList) : []
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
			// uni.setStorageSync('pathList', JSON.stringify(state.list))
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
		// 从服务端获取收货地址数据
		fetchPathData({commit, state}, callback = false) {
			$api.get('/useraddresses/' + state.page, {}, {token: true}).then(res => {
				console.log(res);
				if (typeof callback === 'function') callback(true)
				if (res.length === 0) {
					state.list = state.page === 1 ? [] : state.list
					return
				}
				// 处理服务端返回的数据
				res.forEach((v, i) => {
					v.isdefault = (i === 0 && v.last_used_time !== null) ? true : false
				})
				state.list = state.page === 1 ? res : [...state.list, ...res]
				
			}).catch(err => {
				if (typeof callback === 'function') callback(false)
			})
		},
		// 新增收货地址
		createPathAction({commit, state}, item) {
			if (item.isdefault) {
				commit('removeDefault')
			}
			commit('createPath', item)
			// 收货地址有改动 持久化数据
			// uni.setStorageSync('pathList', JSON.stringify(state.list))
		},
		// 修改收货地址
		updatePathAction({commit}, obj) {
			if (obj.item.isdefault) {
				commit('removeDefault')
			}
			commit('updatePath', obj)
			// 收货地址有改动 持久化数据
			// uni.setStorageSync('pathList', JSON.stringify(state.list))
		}
	}
}
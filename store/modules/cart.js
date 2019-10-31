export default {
	state: {
		list: [
			{
				checked: false,
				id: 1,
				title: "商品标题111",
				cover: "/static/images/demo/list/1.jpg",
				// 当前商品的可选属性
				attrs: [
					{
						title: "颜色",
						selected: 0,
						list: [
							{ name: "火焰色" },
							{ name: "炭黑" },
							{ name: "冰川蓝" }
						]
					},
					{
						title: "容量",
						selected: 0,
						list: [
							{ name: "64GB" },
							{ name: "128GB" }
						]
					},
					{
						title: "套餐",
						selected: 0,
						list: [
							{ name: "标配" },
							{ name: "套餐一" },
							{ name: "套餐二" }
						]
					}
				],
				pprice: 998,
				num: 1,
				minnum: 1,
				maxnum: 10   // 商品库存
			}
		],
		// 选中列表 (存放选中的商品的id)
		selectedList: [],
		// popup弹出框是否显示
		popupShow: "none",
		// 当前弹出框所修改的商品的索引
		popupIndex: -1,
	},
	getters: {
		// 判断是否全选
		checkedAll: (state) => {
			return state.list.length === state.selectedList.length
		},
		// 计算总金额
		totalPrice: (state) => {
			let total = 0
			state.list.forEach(v => {
				if (state.selectedList.indexOf(v.id) > -1) {
					total += (v.pprice * v.num)
				}
			})
			return total
		},
		// 禁用全选
		disableSelectAll: (state) => {
			return state.list.length === 0
		},
		// 获取当前需要修改属性的商品
		popupData: (state) => {
			return state.popupIndex > -1 ? state.list[state.popupIndex] : {}
		}
	},
	mutations: {
		// 选中/取消选中某个商品
		selectItem(state, index) {
			// 根据索引获取当前商品的id
			let id = state.list[index].id
			let i = state.selectedList.indexOf(id)
			// 如果已经是选中状态，则取消选中
			if (i > -1) {
				// 取消当前商品的选中状态
				state.list[index].checked = false
				// 从选中列表中移除当前商品的id
				state.selectedList.splice(i, 1)
			} else {
				state.list[index].checked = true
				state.selectedList.push(id)
			}
		},
		// 全选
		selectAll(state) {
			state.selectedList = state.list.map(v => {
				// 设置全选涉及的每个商品都为选中状态
				v.checked = true
				return v.id
			})
		},
		// 取消全选
		unSelectAll(state) {
			state.list.forEach(v => {
				// 设置每个商品都为非选中状态
				v.checked = false
			})
			state.selectedList = []
		},
		// 删除购物车中选中的商品
		delGoods(state) {
			state.list = state.list.filter(v => {
				return state.selectedList.indexOf(v.id) === -1
			})
		},
		// 初始化popupIndex
		initPopupIndex(state, index) {
			state.popupIndex = index
		}
	},
	actions: {
		// 显示弹出框
		doShowPopup({state, commit}, index) {
			commit('initPopupIndex', index)
			state.popupShow = 'show'
		},
		// 隐藏弹出框
		doHidePopup({state, commit}) {
			state.popupShow = 'hide'
			setTimeout(() => {
				state.popupShow = 'none'
				commit('initPopupIndex', -1)
			}, 200)
		},
		doSelectAll({commit, getters}) {
			if (getters.checkedAll) {
				commit('unSelectAll')
			} else {
				commit('selectAll')
			}
		},
		doDelGoods({commit}) {
			uni.showModal({
				content: "是否删除选中的商品",
				success: (res) => {
					if (res.confirm) {
						commit('delGoods')
						uni.showToast({title: "删除成功"})
					}
				}
			})
		}
	}
}
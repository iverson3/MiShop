
/*
{
	checked: false,
	id: 25,
	title: "测试专用商品只有这个测试专用商品只有这个测试专用商品只有这个测试专用商品只有这个测试专用商品只有这个",
	cover: "/static/images/demo/list/1.jpg",
	pprice: 998,
	num: 1,
	minnum: 1,
	maxnum: 10,   // 商品库存
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
				{ name: "标配史蒂芬森的啥接电话对技长度很长" },
				{ name: "套餐一" },
				{ name: "套餐二" }
			]
		}
	]
}
*/

// 所有购物车数据
let defaultData = [
	{
		checked: false,
		id: 25,
		title: "韩国ins柠檬黄边框苹果X手机壳Iphonexsmax/8plus/7p/XR透明6软壳",
		cover: "/static/images/demo/list/1.jpg",
		sku_type: 1,
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
]


export default {
	state: {
		isedit: false,
		
		list: defaultData,
		// 选中列表 (存放选中的商品的id)
		selectedList: [],
		// popup弹出框是否显示
		popupShow: "none",
		// 当前弹出框所修改的商品的索引
		popupIndex: -1,
	},
	getters: {
		// 判断是否有商品被选中
		someChecked: (state) => {
			return state.selectedList.length > 0
		},
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
		},
		// 获取购物车中选中的商品的详细信息列表
		selectedInfoList: (state) => {
			let infoList = []
			state.list.forEach(v => {
				if (state.selectedList.indexOf(v.id) > -1) {
					infoList.push(v)
				}
			})
			return infoList
		}
	},
	mutations: {
		// 初始化购物车数据
		initCartData(state) {
			let cartList = uni.getStorageSync('cartList')
			state.list = cartList? JSON.parse(cartList) : defaultData
		},
		// 用户退出登录之后隐藏购物车数据
		hideCartData(state) {
			state.list = []
		},
		
		// 商品属性弹出框中修改了任意数据
		attrsChange(state, obj) {
			state.list[obj.index].pprice = obj.pprice
			state.list[obj.index].maxnum = obj.maxnum
			state.list[obj.index].attrs = obj.attrs
			// 购物车数据有改动 持久化数据
			uni.setStorageSync('cartList', JSON.stringify(state.list))
		},
		numChange(state, obj) {
			state.list[obj.index].num = obj.num
			// 购物车数据有改动 持久化数据
			uni.setStorageSync('cartList', JSON.stringify(state.list))
		},
		
		changeEditStatus(state) {
			state.isedit = !state.isedit
		},
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
			// 购物车数据有改动 持久化数据
			uni.setStorageSync('cartList', JSON.stringify(state.list))
		},
		// 全选
		selectAll(state) {
			state.selectedList = state.list.map(v => {
				// 设置全选涉及的每个商品都为选中状态
				v.checked = true
				return v.id
			})
			// 购物车数据有改动 持久化数据
			uni.setStorageSync('cartList', JSON.stringify(state.list))
		},
		// 取消全选
		unSelectAll(state) {
			state.list.forEach(v => {
				// 设置每个商品都为非选中状态
				v.checked = false
			})
			state.selectedList = []
			// 购物车数据有改动 持久化数据
			uni.setStorageSync('cartList', JSON.stringify(state.list))
		},
		// 删除购物车中选中的商品
		delGoods(state) {
			state.list = state.list.filter(v => {
				return state.selectedList.indexOf(v.id) === -1
			})
			// 清空选中列表
			state.selectedList = []
			// 购物车数据有改动 持久化数据
			uni.setStorageSync('cartList', JSON.stringify(state.list))
		},
		// 初始化popupIndex
		initPopupIndex(state, index) {
			state.popupIndex = index
		},
		// 加入购物车 (不允许购物车中具有相同id的产品)
		addGoodsToCart(state, goods) {
			// 临时测试使用
			if (goods.id === 25) {
				goods.title = "韩国ins柠檬黄边框苹果X手机壳Iphonexsmax/8plus/7p/XR透明6软壳"
			}
			
			// 判断购物车中是否已经存在该商品
			let res = state.list.find(function(v){
				return v.id === goods.id
			})
			if (res) {
				// 准备新加入购物车的商品 在购物车中已存在id一样的商品的情况下
				// 不添加该商品到购物车 只增加相应的数量
				goods.num = res.num + goods.num
				// 删除旧的商品数据
				state.list = state.list.filter(function(v){
					return v.id !== goods.id
				})
				// 使用unshift()加入到数组头部
				state.list.unshift(goods)
				
			} else {
				// 使用unshift()加入到数组头部
				state.list.unshift(goods)
			}
			// 购物车数据有改动 持久化数据
			uni.setStorageSync('cartList', JSON.stringify(state.list))
		},
		// 加入购物车 (允许购物车中商品id相同 选择的属性不同)
		// 目前弃用这种策略
		addGoodsToCart_old(state, goods) {
			console.log(goods);
			// 判断购物车中是否已经存在该商品
			let res = state.list.filter(function(v){
				return v.id === goods.id
			})
			// 存在id一样的商品
			if (res.length > 0) {
				let mark = -1
				// 循环购物车中商品id与即将加入购物车的商品id相同的商品列表
				for (let key in res) {
					let same = true
					// 对比选中的商品属性是否完全一致
					for (let k in res[key].attrs) {
						if (res[key].attrs[k].selected !== goods.attrs[k].selected) {
							same = false
						}
					}
					if (same) {
						mark = key
					}
				}
				// mark不等于-1 则表示购物车中原有的商品中 有商品和即将加入购物车的商品完全一样(包括id和选择的属性)
				if (mark !== -1) {
					// 准备新加入购物车的商品 在购物车中已存在完全一样(包括选中的属性)的商品的情况下
					// 不添加该商品到购物车 只增加相应的数量
					res[mark].num = res[mark].num + goods.num
					// 删除旧的商品数据 (判断需要删除的商品时 既要判断id相同 还要判断选中的属性完全一样)
					state.list = state.list.filter(function(v){
						let same = true
						// 对比选中的商品属性是否完全一致
						for (let k in v.attrs) {
							if (v.attrs[k].selected !== goods.attrs[k].selected) {
								same = false
							}
						}
						return !(v.id === res[mark].id && same)
					})
					// 使用unshift()加入到数组头部
					state.list.unshift(res[mark])
					
				} else {
					// 使用unshift()加入到数组头部
					state.list.unshift(goods)
				}
			} else {
				// 使用unshift()加入到数组头部
				state.list.unshift(goods)
			}
		}
	},
	actions: {
		// 显示弹出框
		doShowPopup({state, commit, getters}, index) {
			// 只有在编辑状态下才能显示弹出框
			// if (state.isedit) {
				commit('initPopupIndex', index)
				state.popupShow = 'show'
			// }
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
		doDelGoods({state, commit}, needShowModal) {
			if (!needShowModal) {
				commit('delGoods')
				return
			}
			// 判断是否有商品被选中
			if (state.selectedList.length === 0) {
				uni.showToast({title: "请先选择商品"})
				return
			}
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
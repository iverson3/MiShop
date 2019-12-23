export default {
	state: {
		tempOrder: {
			id: 0,
			no: '',         // 订单编号 格式： orderno20191108110635
			create_time: "",// 订单创建时间 (时间字符串)  格式： 2019-08-12 12:28:35
			status: "未知",  
			statusNo: 0,    // 订单状态
			order_items: [],// 商品列表数据
			total_num: 1,   // 商品总数
			total_price: 0, // 商品总价  
			pay_price: 0,   // 实际支付金额 (实际付款 = 商品总价 + 运费 - 优惠券金额)
			freight: 0,     // 运费
			coupon_id: 0,   // 优惠券id
			path_id: 0,     // 收货地址id
		},
		// 0-未知 1-待支付 2-待发货 3-待收货 4-待评价 5-支付失败 6-已取消 7-退款中 8-退款成功 9-退款失败
		statusList: [
			{
				status: '未知状态',
				statusNo: 0,
				icon: "icon-unknown"
			},
			{
				status: '待支付',
				statusNo: 1,
				icon: "icon-daifukuan"
			},
			{
				status: '待发货',
				statusNo: 2,
				icon: "icon-daifahuo"
			},
			{
				status: '待收货',
				statusNo: 3,
				icon: "icon-daishouhuo"
			},
			{
				status: '待评价',
				statusNo: 4,
				icon: "icon-daipingjia"
			},
			{
				status: '支付失败',
				statusNo: 5,
				icon: "icon-daipingjia"
			},
			{
				status: '已取消',
				statusNo: 6,
				icon: "icon-daipingjia"
			},
			{
				status: '退款中',
				statusNo: 7,
				icon: "icon-tuihuo"
			},
			{
				status: '退款成功',
				statusNo: 8,
				icon: "icon-tuihuo"
			},
			{
				status: '退款失败',
				statusNo: 9,
				icon: "icon-tuihuo"
			}
		],
		
		list: []
	},
	getters: {
		// 通过订单id获取对应的订单数据 返回值是对象
		getOrderInfoById: (state) => (id) => {
			return state.list.find(v => {
				return v.id === id
			})
		},
		// 获取指定状态对应的订单列表数据 返回值是数组
		getOrderListByStatus: (state) => (status) => {
			return state.list.filter(v => {
				return v.statusNo === status
			})
		}
	},
	mutations: {
		// 初始化订单数据
		initOrderData(state) {
			let orderList = uni.getStorageSync('orderList')
			state.list = orderList? JSON.parse(orderList) : []
		},
		// 用户退出登录之后隐藏当前用户的订单数据
		hideOrderData(state) {
			state.list = []
		},
		
		setOrderList(state, list) {
			state.list = list
		},
		
		// 添加临时订单
		addTempOrder(state, data) {
			state.tempOrder = data
		},
		// 删除临时订单
		deleteTempOrder(state) {
			state.tempOrder = {}
		},
		// 创建新订单
		createOrder(state, data) {
			state.list.unshift(data)
			// 修改数据之后持久化
			uni.setStorageSync('orderList', JSON.stringify(state.list))
		},
		// 修改订单状态
		changeOrderStatus(state, obj) {
			// 先得到该订单的数据
			let item = state.list.find(v => {
				return v.id === obj.id
			})
			// 再从订单列表中删除该订单
			state.list = state.list.filter(v => {
				return v.id !== obj.id
			})
			// 接着修改该订单的状态
			item.statusNo = obj.new_status
			item.status = state.statusList[obj.new_status].status
			// 最后再将该订单插入到订单列表的最前面
			state.list.unshift(item)
			
			// 修改数据之后持久化
			uni.setStorageSync('orderList', JSON.stringify(state.list))
		},
		// 重新下单 (已取消状态的订单可以重新下单)
		reCreateOrder(state, item) {
			let id = item.id
			// 初始化订单的相关字段
			item.id = 0
			item.orderNo = ""
			item.create_time = 0
			item.status = "临时订单"
			item.statusNo = 0
			item.path_id = 0
			// 将该订单设置为临时订单
			state.tempOrder = item
			
			// 从订单列表中移除该id对应的订单
			state.list = state.list.filter(v => {
				return v.id !== id
			})
			// 修改数据之后持久化
			uni.setStorageSync('orderList', JSON.stringify(state.list))
		},
		// 删除订单
		deleteOrderById(state, id) {
			// 从订单列表中移除该id对应的订单  
			state.list = state.list.filter(v => {
				return v.id !== id
			})
			// 修改数据之后持久化
			uni.setStorageSync('orderList', JSON.stringify(state.list))
		}
	},
	actions: {
		// 创建新订单 并删除临时订单
		doCreateOrder({commit, state}, data) {
			commit('createOrder', data)
			commit('deleteTempOrder')
		}
	}
}

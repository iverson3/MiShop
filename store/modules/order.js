/*
{
						id: 1,
						create_time: "2019-08-12",
						status: "已取消",
						statusNo: 6,
						order_items: [
							{
								id: 25,
								cover: "/static/images/demo/list/5.jpg",
								title: "小米8",
								pprice: 1999.00,
								attrs: "金色 标配",
								num: 1
							}
						],
						total_num: 1,
						total_price: 1999.00
					},
					{
						id: 2,
						create_time: "2019-08-12",
						status: "已发货",
						statusNo: 3,
						order_items: [
							{
								id: 25,
								cover: "/static/images/demo/list/1.jpg",
								title: "小米8",
								pprice: 1999.00,
								attrs: "金色 标配",
								num: 1
							},
							{
								id: 25,
								cover: "/static/images/demo/list/2.jpg",
								title: "小米8",
								pprice: 1999.00,
								attrs: "金色 标配",
								num: 1
							}
						],
						total_num: 2,
						total_price: 6999.00
					},
					{
						id: 3,
						create_time: "2019-08-12",
						status: "待发货",
						statusNo: 2,
						order_items: [
							{
								id: 25,
								cover: "/static/images/demo/list/3.jpg",
								title: "小米8",
								pprice: 1999.00,
								attrs: "金色 标配",
								num: 1
							}
						],
						total_num: 1,
						total_price: 1999.00
					},
					{
						id: 4,
						create_time: "2019-08-12",
						status: "待评价",
						statusNo: 4,
						order_items: [
							{
								id: 25,
								cover: "/static/images/demo/list/3.jpg",
								title: "小米8",
								pprice: 1999.00,
								attrs: "金色 标配",
								num: 1
							}
						],
						total_num: 1,
						total_price: 1999.00
					}
*/


let defaultData = [
			{
				type: 'all',
				typeNo: 0, 
				data: []
			},
			{
				type: 'waitPay',
				typeNo: 1, 
				data: []
			},
			{
				type: 'waitShip',
				typeNo: 2, 
				data: []
			},
			{
				type: 'waitReceipt',
				typeNo: 3, 
				data: []
			},
			{
				type: 'waitComment',
				typeNo: 4, 
				data: []
			}
		]

let orderList = uni.getStorageSync('orderList')
let initData = orderList? JSON.parse(orderList) : defaultData

export default {
	state: {
		tempOrder: {
			id: 0,
			orderNo: '',    // 订单编号 格式： orderno20191108110635
			create_time: 0, // 订单创建时间 (时间戳)  显示： 2019-08-12
			status: "待发货",
			statusNo: 2,
			order_items: [],
			total_num: 1, // 商品总数
			total_price: 0, // 商品总价  
			pay_price: 0,   // 实际支付金额 (实际付款 = 商品总价 + 运费 - 优惠券金额)
			freight: 0,   // 运费
			coupon_id: 0, // 优惠券
			path_id: 0,   // 收货地址id
		},
		// 0-未知 1-待支付 2-待发货 3-待收货 4-待评价 5-支付失败 6-已取消 7-退货退款中
		statusList: [
			{
				status: '未知状态',
				statusNo: 0
			},
			{
				status: '待支付',
				statusNo: 1
			},
			{
				status: '待发货',
				statusNo: 2
			},
			{
				status: '待收货',
				statusNo: 3
			},
			{
				status: '待评价',
				statusNo: 4
			},
			{
				status: '支付失败',
				statusNo: 5
			},
			{
				status: '已取消',
				statusNo: 6
			},
			{
				status: '退货退款中',
				statusNo: 7
			}
		],
		
		list: initData
	},
	getters: {
		getOrderInfoById: (state) => (id) => {
			return state.list[0].data.find(v => {
				return v.id === id
			})
		}
	},
	mutations: {
		// 添加临时订单
		addTempOrder(state, data) {
			state.tempOrder = data
		},
		// 创建新订单
		createOrder(state, data) {
			state.list[0].data.unshift(data)
			state.list[data.statusNo].data.unshift(data)
			// 修改数据之后持久化
			uni.setStorageSync('orderList', JSON.stringify(state.list))
		},
		// 删除临时订单
		deleteTempOrder(state) {
			state.tempOrder = {}
		},
		
		// 修改订单状态
		changeOrderStatus(state, obj) {
			let item = state.list[0].data.find(v => {
				return v.id === obj.id
			})
			// 先移除  
			state.list[0].data = state.list[0].data.filter(v => {
				return v.id !== obj.id
			})
			// 修改状态
			item.statusNo = obj.new_status
			item.status = state.statusList[obj.new_status].status
			// 再插入到最前面
			state.list[0].data.unshift(item)
			
			
			if (obj.new_status <= 4) {
				let item2 = state.list[obj.old_status].data.find(v => {
					return v.id === obj.id
				})
				// 修改状态
				item2.statusNo = obj.new_status
				item2.status = state.statusList[obj.new_status].status
				// 再插入到最前面
				state.list[obj.new_status].data.unshift(item2)
			}
			// 先移除  
			state.list[obj.old_status].data = state.list[obj.old_status].data.filter(v => {
				return v.id !== obj.id
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

// 助手函数
export default {
	// 更新购物车tabbar角标数字
	updateCartBadge(count) {
		if (count > 0) {
			uni.setTabBarBadge({
				index: 2,
				text: count.toString()
			})
		} else {
			// 购物车商品数为0 则移除badge角标数字
			uni.removeTabBarBadge({
				index: 2
			})
		}
	},
	
	// 判断订单状态
	formatOrderStatus(order) {
		if (!order) return '未知状态'
		// 未支付
		if (!order.paid_time) return '待支付'
		// 退款情况
		if (order.refund_status !== 'pending') {
			switch (order.refund_status){
				case 'applied':
					return '退款中'
					break;
				case 'success':
					return '退款成功'
					break;
				case 'failed':
					return '退款失败'
					break;
				default:
					return '未知状态'
					break;
			}
		}
		switch (order.ship_status){
			case 'pending':
				return '待发货'
				break;
			case 'delivered':
				return '待收货'
				break;
			case 'received':
				return '待评价' // 已签收
				break;
			default:
				return '未知状态'
				break;
		}
	}
}
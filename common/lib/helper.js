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
	}
}
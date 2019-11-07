export default {
	// 全局配置
	common: {
		baseUrl: "http://ceshi3.dishait.cn/api",
		header: {
			'Content-Type': "application/json;charset=UTF-8",
			'Content-Type': "application/x-www-form-urlencoded"
		},
		data: {},
		method: 'GET',
		dataType: 'json'
	},
	
	// 请求 返回Promise
	request(options = {}, errCallback = false) {
		// 组织参数
		options.url = this.common.baseUrl + options.url
		options.header = options.header || this.common.header
		options.data = options.data || this.common.data
		options.method = options.method || this.common.method
		options.dataType = options.dataType || this.common.dataType
		
		return new Promise((res, rej) => {
			// 请求之前 拦截器 todo
			
			uni.request({
				...options,
				success: (result) => {
					console.log(result);
					// 服务端出错
					if (result.statusCode !== 200) {
						// uni.showToast({title: "code: " + result.statusCode, icon: 'none'});
						uni.showToast({
							title: result.data.msg || '服务端出错',
							icon: 'none'
						});
						return rej()
					}
					// 请求成功
					let data = result.data.data
					res(data)
				},
				fail: (error) => {
					if (typeof errCallback === 'function') errCallback(false, 'requestFail')
					console.log(error);
					let errorInfo = "原因未知"
					if (error.errMsg) {
						// 根据错误信息给与对应的友好化错误提示
						switch (error.errMsg){
							case "request:fail abort":
								errorInfo = "没有网络"
								break;
							case "Route Not Found":
								errorInfo = "服务端出错"
								break;
							default:
								break;
						}
					}
					// uni.showToast({title: error.errMsg, icon: 'none'});
					uni.showToast({title: "请求失败，" + errorInfo, icon: 'none'});
					return rej()
				}
			});
		})
		
	},
	
	// GET请求
	get(url, data = {}, options = {}, errCallback = false) {
		options.url = url
		options.data = data
		options.method = 'GET'
		return this.request(options, errCallback)
	},
	
	// POST请求
	post(url, data = {}, options = {}, errCallback = false) {
		options.url = url
		options.data = data
		options.method = 'POST'
		return this.request(options, errCallback)
	},
}
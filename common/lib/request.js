import $store from '@/store/index.js';

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
		options.url =  options.url.indexOf("http") === 0 ? options.url : this.common.baseUrl + options.url
		options.header = options.header || this.common.header
		options.data = options.data || this.common.data
		options.method = options.method || this.common.method
		options.dataType = options.dataType || this.common.dataType
		
		// 判断是否需要在请求头中加入token字段信息
		if (options.token) {
			// 判断token是否为空
			if (options.checkToken && !$store.state.user.token) {
				uni.showToast({title: '请先登录', icon: 'none'});
				uni.navigateTo({url: '/pages/login/login'});
				return
			}
			options.header.token = $store.state.user.token
		}
		// 判断是否有toast参数
		if (typeof options.toast === 'undefined') {
			// 没有传参数toast 则给默认值true 即表示默认显示全局的toast错误提示
			options.toast = true
		}
		
		console.log('options.data');
		console.log(options.url);
		console.log(options.data);
		
		return new Promise((res, rej) => {
			// 请求之前 拦截器 todo
			
			uni.request({
				...options,
				success: (result) => {
					console.log(result);
					// 返回请求结果的原始数据 (支付类的请求需要原始数据进行业务处理)
					if (options.native) {
						return res(result)
					}
					// 服务端出错
					if (result.statusCode !== 200) {
						
						// 判断是否需要显示全局通用的错误提示 （默认显示提示  传入toast参数并且是false则不显示提示）
						if (options.toast) {
							// uni.showToast({title: "code: " + result.statusCode, icon: 'none'});
							uni.showToast({
								title: result.data.msg || '服务端出错',
								icon: 'none'
							});
						}
						return rej(result)
					}
					// 请求成功
					let data = result.data.data
					res(data)
				},
				fail: (error) => {
					if (typeof errCallback === 'function') errCallback(false, 'requestFail')
					console.log(error);
					
					// 判断是否需要显示全局通用的错误提示 （默认显示提示  传入toast参数并且是false则不显示提示）
					if (options.toast) {
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
								case "request:fail timeout":
									errorInfo = "请求超时"
									break;
								default:
									break;
							}
						}
						// uni.showToast({title: error.errMsg, icon: 'none'});
						uni.showToast({title: "请求失败，" + errorInfo, icon: 'none'});
					}
					
					return rej(error)
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
	
	// DELETE请求
	del(url, data = {}, options = {}, errCallback = false) {
		options.url = url
		options.data = data
		options.method = 'DELETE'
		return this.request(options, errCallback)
	},
}
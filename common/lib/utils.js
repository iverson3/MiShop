export default {
	
	dateUtils: {
		UNITS: {
			'年': 31557600000,
			'月': 2629800000,
			'天': 86400000,
			'小时': 3600000,
			'分钟': 60000,
			'秒': 1000
		},
		humanize: function (milliseconds) {
			var humanize = '';
			for (var key in this.UNITS) {
				if (milliseconds >= this.UNITS[key]) {
					humanize = Math.floor(milliseconds / this.UNITS[key]) + key + '前';
					break;
				}
			}
			return humanize || '刚刚';
		},
		format: function (dateStr) {
			var date = this.parse(dateStr)
			var diff = Date.now() - date.getTime();
			if (diff < this.UNITS['天']) {
				return this.humanize(diff);
			}
			var _format = function (number) {
				return (number < 10 ? ('0' + number) : number);
			};
			return date.getFullYear() + '/' + _format(date.getMonth() + 1) + '/' + _format(date.getDate()) + '-' +
				_format(date.getHours()) + ':' + _format(date.getMinutes());
		},
		parse: function (str) { //将"yyyy-mm-dd HH:MM:ss"格式的字符串，转化为一个Date对象
			var a = str.split(/[^0-9]/);
			return new Date(a[0], a[1] - 1, a[2], a[3], a[4], a[5]);
		}
	},
	
    formatTime(time) {
		if (typeof time !== 'number' || time < 0) {
			return time
		}
	
		var hour = parseInt(time / 3600)
		time = time % 3600
		var minute = parseInt(time / 60)
		time = time % 60
		var second = time
	
		return ([hour, minute, second]).map(function (n) {
			n = n.toString()
			return n[1] ? n : '0' + n
		}).join(':')
	},
	
	formatLocation(longitude, latitude) {
		if (typeof longitude === 'string' && typeof latitude === 'string') {
			longitude = parseFloat(longitude)
			latitude = parseFloat(latitude)
		}
	
		longitude = longitude.toFixed(2)
		latitude = latitude.toFixed(2)
	
		return {
			longitude: longitude.toString().split('.'),
			latitude: latitude.toString().split('.')
		}
	},

	/* 
	 * 将cityNo 转 cityName
	 * cityData:原数据
	 * cityNo：二级地区编码
	 */
	getCityName(cityData, cityNo) {
		if (!cityNo) return;
		if (!(cityData instanceof Array)) return;
		// 9112
		cityNo += "";
		for (let i = 0; i < cityData.length; i++) {
			let sheng = cityData[i];
			for (let j = 0; j < sheng.children.length; j++) {
				let shi = sheng.children[j];
				if (shi.value == cityNo) {
					// 使用return 终止循环
					return `${sheng.label}-${shi.label}`;
				}
			}
		}
	},

	/* 
	 * obj 转 params字符串参数  
	 * 例子：{a:1,b:2} => a=1&b=2
	 */
	objParseParam(obj) {
		let paramsStr = "";
		if (obj instanceof Array) return paramsStr;
		if (!(obj instanceof Object)) return paramsStr;
		for (let key in obj) {
			paramsStr += `${key}=${obj[key]}&`;
		}
		return paramsStr.substring(0, paramsStr.length - 1);
	},

	/* 
	 * obj 转 路由地址带参数
	 * 例子：{a:1,b:2} => /pages/index/index?a=1&b=2
	 */
	objParseUrlAndParam(path, obj) {
		let url = path || "/";
		let paramsStr = "";
		if (obj instanceof Array) return url;
		if (!(obj instanceof Object)) return url;
		paramsStr = this.objParseParam(obj);
		paramsStr && (url += "?");
		url += paramsStr;
		return url;
	},

	/* 
	 * 获取url字符串参数
	 */
	getRequestParameters(locationhref) {
		let href = locationhref || "";
		let theRequest = new Object();
		let str = href.split("?")[1];
		if (str != undefined) {
			let strs = str.split("&");
			for (let i = 0; i < strs.length; i++) {
				theRequest[strs[i].split("=")[0]] = (strs[i].split("=")[1]);
			}
		}
		return theRequest;
	},

	/* 
	 * 银行卡每四位空格
	 */
	formatCardNo(cardNo) {
		cardNo += "";
		return cardNo.replace(/\s/g, '').replace(/[^\d]/g, '').replace(/(\d{4})(?=\d)/g, '$1 ');
	},

	/**
	 * 乘法，解决js精度损失问题
	 * @param {*} arg1 
	 * @param {*} arg2 
	 */
	accMul(arg1, arg2) {
		arg1 = arg1 || 0;
		var m = 0,
			s1 = arg1.toString(),
			s2 = arg2.toString();
		try {
			m += s1.split(".")[1].length
		} catch (e) {}
		try {
			m += s2.split(".")[1].length
		} catch (e) {}
		return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m)
	},
	
	/**
	 * extend([deep], target, ...source)
	 * @param {type} deep
	 * @param {type} target
	 * @param {type} ...source
	 * @returns {unresolved}
	 * 其实可能还可以利用 Object.assign() 函数做个递归来实现类似的功能。
	 * 今天才知道原来 vue 已经有 extend 包了，悲剧，搞了我几天了，刚从 mui 里面剥离了这段函数出来
	 * 不过 npm 包的方式使用有点烦，特地安装这个包看了下源码，也是从 jQuery 里面剥离的
	* 但是在 uni-app 里面感觉去安装 npm 包有点重，所以如果是小项目一个包都没用的，就不为了这个功能去安装包了
	* 安装方法： npm install extend
	* 
	* 使用方法：  obj = extend(true, obj, data);
	 */
	extend() {        // from jquery2
		//辅助函数
		var class2type = {};
			var cT=['Boolean', 'Number', 'String', 'Function', 'Array', 'Date', 'RegExp', 'Object', 'Error'];
		   cT.forEach(function(v, i, a){
			class2type["[object " + v + "]"] = v.toLowerCase();
		});     
		var dataType = function(obj) {
			return obj == null ? String(obj) : class2type[{}.toString.call(obj)] || "object";
		};
			var isArray = Array.isArray ||
				function(object) {
					return object instanceof Array;
				   };
			var isObject = function(obj) {
				return dataType(obj) === "object";
			};
			var isPlainObject = function(obj) {
				return isObject(obj) && !isWindow(obj) && Object.getPrototypeOf(obj) === Object.prototype;
			};
		var isWindow = function(obj) {
			return obj != null && obj === obj.window;
		};         
			var isEmptyObject = function(o) {
				for (var p in o) {
					if (p !== undefined) {
						return false;
					}
				}
				return true;
			};
			var isFunction = function(value) {
				return dataType(value) === "function";
			};     
		 
		   //函数主体开始
		var options, name, src, copy, copyIsArray, clone,
			target = arguments[0] || {},
			i = 1,
			length = arguments.length,
			deep = false;
	
		if (typeof target === "boolean") {
			deep = target;
	
			target = arguments[i] || {};
			i++;
		}
	
		if (typeof target !== "object" && !isFunction(target)) {
			target = {};
		}
	
		if (i === length) {
			target = this;
			i--;
		}
	
		for (; i < length; i++) {
			if ((options = arguments[i]) != null) {
				for (name in options) {
					src = target[name];
					copy = options[name];
	
					if (target === copy) {
						continue;
					}
	
					if (deep && copy && (isPlainObject(copy) || (copyIsArray = isArray(copy)))) {
						if (copyIsArray) {
							copyIsArray = false;
							clone = src && isArray(src) ? src : [];
	
						} else {
							clone = src && isPlainObject(src) ? src : {};
						}
	
						target[name] = extend(deep, clone, copy);
	
					} else if (copy !== undefined) {
						target[name] = copy;
					}
				}
			}
		}
		return target;
	},
}

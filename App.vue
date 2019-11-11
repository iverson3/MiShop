<script>
	export default {
		// 定义全局变量 (任何页面都可以获取和修改 包括nvue页面)
		globalData: {
			text: ""
		},
		
		// 监听nvue页面使用uni.postMessage()发送过来的数据
		onUniNViewMessage: function(e) {
			// 获取nvue页面发送过来的数据
			let data = e.message;
			if (data.from && data.from === 'index') {
				// 触发自定义的全局事件 (在需要的地方监听)
				uni.$emit('index', data)
			}
			
			/* vue 与 nvue 页面之间通信 传递数据
			
			方式一：  在nvue页面使用uni.postMessage(data)向vue发送数据通讯
			        在App.vue里使用onUniNViewMessage()监听来自nvue页面发送的数据
					
			方式二：  在vue页面里使用 plus.webview.postMessageToUniNView(data,nvueId) 发送消息给nvue
			        在nvue里引用 globalEvent 模块监听 plusMessage 事件接受vue页面发送过来的数据
			*/
		   
		    /* vue 和 nvue 共享变量和数据
			
			1. vuex    (nvue支持vuex 但暂时只支持uni-app编译模式，不支持weex编译模式)
			           注意： 不支持直接引入store使用，可以使用mapState、mapGetters、mapMutations等辅助方法或者使用this.$store
			
			2. uni.storage   vue和nvue页面可以使用相同的uni.storage存储。这个存储是持久化的
			
			3. globalData    小程序有globalData机制，这套机制在uni-app里也可以使用，全端通用。 在App.vue文件里定义globalData
			                 注意： js中操作globalData的方式如下： getApp().globalData.text = 'test'
							       如果需要把globalData的数据绑定到页面上，可在页面的onShow声明周期里进行变量重赋值
		    */
		},
		
		onLaunch: function() {
			console.log('App Launch')
			
			// 应用启动的时候，调用user模块里面的mutation对用户状态进行初始化
			this.$store.commit('initUserStatus')
			
			// 判断用户是否处于登录状态 来决定是否初始化一些相关数据
			let loginStatus = uni.getStorageSync('loginStatus')
			// let token = uni.getStorageSync('token')
			if (loginStatus && loginStatus === true) {
				this.$store.commit('initCartData')
				this.$store.commit('initOrderData')
			}
			
			// 设置"未读的红点"
			setTimeout(() => {
				uni.setTabBarBadge({
					index: 3,
					text: '3'
				});
				uni.showTabBarRedDot({
					index: 2
				});
			}, 1000);
		},
		onShow: function() {
			// 检查网络状况
			uni.getNetworkType({
				success: (res) => {
					if (res.networkType === 'none') {
						uni.showToast({title: '当前无网络', icon: 'none', duration:3000});
					}
				}
			})
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		},
		onError: function() {
			// 应用运行出错的情况下 可进行一些善后的处理
			console.log('应用运行出错');
		}
	}
</script>

<style>
	/* 每个页面公共css */
	/* uni官方ui库 */
	@import "./common/uni.css";
	/* 第三方动画样式库 */
	@import "./common/animate.css";
	/* 自定义图标库 */
	@import "./common/icon.css";
	@import "./common/icon-more.css";
	/* UI基础库 */
	@import "./common/zcm-main.css";
	/* 自定义全局公共样式 */
	@import "./common/common.css";
</style>

<script>
	export default {
		// 定义全局变量 (任何页面都可以获取和修改)
		globalData: {
			text: ""
		},
		
		// 监听nvue页面使用uni.postMessage()发送过来的数据
		onUniNViewMessage: function(e) {
			// 获取nvue页面发送过来的数据
			let data = e.message;
			if (data.from && data.from === 'index') {
				// 触发自定义的全局事件 (通知class分类页修改数据)
				uni.$emit('index', data)
			}
		},
		onLaunch: function() {
			console.log('App Launch')
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
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
	/* UI基础库 */
	@import "./common/zcm-main.css";
	/* 自定义全局公共样式 */
	@import "./common/common.css";
</style>

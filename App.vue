<script>
	export default {
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

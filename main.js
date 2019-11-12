import Vue from 'vue'
import App from './App'
import store from './store/index.js'
import request from './common/lib/request.js';

Vue.prototype.$store = store
Vue.prototype.$api = request

Vue.config.productionTip = false

// 引入全局的分割线组件
import divider from '@/components/common/divider.vue'
Vue.component('divider', divider)
// 引入全局的加载动画组件
// import loading from '@/components/common/loading.vue'
// Vue.component('loading', loading)
import loadingPlus from '@/common/mixin/loading-plus.vue'
Vue.component('loading-plus', loadingPlus)


// 登录权限跳转
// 自定义一个跳转方法 挂载到Vue上，该跳转方法提供对登录权限的验证
// 即跳转前判断用户是否处于登录状态: 已经登录就进行正常跳转，没有登录则提示并跳到登录页面 
Vue.prototype.navigateTo = (options) => {
	// 判断用户是否登录
	if (!store.state.user.loginStatus) {
		uni.showToast({title: '请先登录', icon: 'none'});
		return uni.navigateTo({url: '/pages/login/login'});
	}
	// 用户处于登录中 则正常跳转
	uni.navigateTo(options);
}

// 判断用户是否处于登录状态
Vue.prototype.isLogin = () => {
	if (store.state.user.loginStatus && store.state.user.loginStatus === true) return true
	return false
}



App.mpType = 'app'

const app = new Vue({
	store,
    ...App
})
app.$mount()

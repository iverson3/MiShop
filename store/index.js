import Vue from 'vue'
import Vuex from 'vuex'

import cart from '@/store/modules/cart.js'
import user from '@/store/modules/user.js'

Vue.use(Vuex)

/* 在uni-app中使用Vuex的模块化管理
注意点: 1. state是根据模块名进行区分的
        2. getters mutations actions是不会根据模块名进行区分的，所以要尽量避免不同的模块中出现重名的
		3. 不同的模块中出现重名的getters 会报错
		4. 不同的模块中出现重名的mutations或actions 不会报错，但在调用时会调用全部重名的mutations或actions
*/
export default new Vuex.Store({
	modules: {
		cart,
		user
	}
})
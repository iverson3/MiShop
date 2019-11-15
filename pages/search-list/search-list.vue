<template>
	<view>
		<!-- 顶部的自定义导航栏 -->
		<view class="w-100 position-fixed top-0 left-0 right-0 bg-white" 
		:style="'z-index: 100;height: '+navbarHeight+'upx;'">
		    <!-- 非微信小程序平台 需要加一个状态栏的占位 -->
			<!-- #ifndef MP-WEIXIN -->
			<view class="uni-status-bar"></view>
			<!-- #endif -->
			
			<view class="w-100 d-flex a-center" style="height: 90upx;">
				<view style="width: 85upx;" class="d-flex a-center j-center" @click="goback">
					<text class="iconfont icon-back" style="font-size: 46upx;color:#6D6D72"></text>
				</view>
				<view class="flex-1 bg-light rounded d-flex a-center text-light-muted" style="height: 65upx;">
					<text class="iconfont icon-sousuo mx-2"></text>
					<input class="flex-1" type="text" v-model="keyword" confirm-type="搜索" />
				</view>
				<view @click="searchBtnClick" style="width: 96upx;" class="d-flex a-center j-center">
					<text style="font-size: 32upx;color: #6D6D72;">搜索</text>
				</view>
			</view>
		</view>
		<!-- 占位 -->
		<view class="w-100" :style="'height: '+navbarHeight+'upx;'"></view>
		
		
		<!-- 排序筛选 -->
		<view class="d-flex border-top border-bottom a-center position-fixed left-0 right-0 bg-white" 
		:style="'height: 100upx;z-index: 100;top: '+navbarHeight+'upx;'">
			<view v-for="(item,index) in screen.list" :key="index" 
			@tap="changeScreen(index)"
			class="flex-1 d-flex j-center a-center font-md">
				<text :class="screen.currentIndex === index ? 'main-text-color':'text-muted'">
					{{ item.name }}
				</text>
				<view>
					<view :class="item.status===1?'main-text-color':'text-light-muted'" class="iconfont icon-paixu-shengxu line-h0"></view>
					<view :class="item.status===2?'main-text-color':'text-light-muted'" class="iconfont icon-paixu-jiangxu line-h0"></view>
				</view>
			</view>
			
			<view @tap="showDrawer" class="flex-1 d-flex j-center a-center main-text-color">筛选</view>
		</view>
		<!-- 占位 -->
		<view class="w-100" style="height: 100upx;"></view>
		
		<!-- 筛选功能的抽屉 -->
		<uni-drawer :visible="showRigth" mode="right" :fixedTop="navbarHeight" @close="closeDrawer">
			<card headTitle="价格范围" :headBorderBottom="false" :headTitleWeight="false">
				<!-- 单选按钮组 -->
				<mi-radio-group :label="label" :selected.sync="label.selected"></mi-radio-group>
			</card>
			<card headTitle="分类" :headBorderBottom="false" :headTitleWeight="false">
				<!-- 单选按钮组 -->
				<mi-radio-group :label="labelcate" :selected.sync="labelcate.selected"></mi-radio-group>
			</card>
			
			<!-- 最底下的两个按钮 -->
			<view class="d-flex position-fixed right-0 w-100 border-top border-light-secondary" :style="'bottom: '+navbarHeight+'upx;'">
				<view class="flex-1 main-bg-color text-white font-md py-2 text-center" 
				@tap="drawerConfirm"
				hover-class="main-bg-hover-color">确定</view>
				<view class="flex-1 font-md py-2 text-center" 
				@tap="drawerReset"
				hover-class="bg-light-secondary">重置</view>
			</view>
		</uni-drawer>
		
		
		<!-- 搜索结果列表 -->
		<block v-for="(item,index) in list" :key="index">
			<search-list :item="item" :index="index"></search-list>
		</block>
		
		<!-- 搜索中提示 -->
		<template v-if="searching">
			<view class="w-100 d-flex j-center a-center" style="padding-top: 150upx;">
				<text class="font-md text-light-muted">搜索中...</text>
			</view>
		</template>
		
		<!-- 数据结果为空 -->
		<no-thing v-if="list.length === 0 && !searching" msg="搜索结果为空"></no-thing>
		
		<template v-if="list.length > 0">
			<!-- 上拉加载更多 -->
			<divider></divider>
			<view class="d-flex a-center j-center text-light-muted font-md py-3">
				{{ loadtext }}
			</view>
		</template>
		
	</view>
</template>

<script>
	import uniDrawer from '@/components/uni-ui/uni-drawer/uni-drawer.vue'
	import card from '@/components/common/card.vue'
	import miRadioGroup from '@/components/common/mi-radio-group.vue'
	import searchList from '@/components/search-list/search-list.vue'
	import noThing from '@/components/common/no-thing.vue'
	import uniStatusBar from '@/components/uni-ui/uni-status-bar/uni-status-bar.vue'
	
	// 三种状态显示的文字
	const PULLLOADMORE = '上拉加载更多'
	const LOADING = '加载中...'
	const NOMORE = '没有更多了'
	
	export default {
		components: {
			uniDrawer,
			card,
			miRadioGroup,
			searchList,
			noThing,
			uniStatusBar
		},
		data() {
			return {
				keyword: "",
				page: 1,
				list: [],
				// 是否正在搜索请求中
				searching: false,
				loadtext: "",
				statusBarHeight: 0,
				navbarHeight: 90,
				
				showRigth: false,
				screen: {
					currentIndex: 0,
					list: [
						{name: "综合", status: 1, key: "all"},
						{name: "销量", status: 0, key: "sale_count"},
						{name: "价格", status: 0, key: "min_price"}
					]
				},
				
				condition: {},
				label: {
					selected: 0,
					oldSelected: 0,
					list: [
						{name: '不限', rule: "", value: ""},
						{name: '0-50', rule: "between", value: "0,50"},
						{name: '50-100', rule: "between", value: "50,100"},
						{name: '100-500', rule: "between", value: "100,500"},
						{name: '500-1000', rule: "between", value: "500,1000"},
						{name: '大于1000', rule: ">", value: "1000"}
					]
				},
				labelcate: {
					selected: 0,
					list: [
						{name: '耳机'},
						{name: '户外'},
						{name: '配件'}
					]
				}
				
			}
		},
		computed: {
			// 排序方式
			options() {
				let obj = this.screen.list[this.screen.currentIndex]
				return {
					[obj.key]: obj.status === 1? 'asc' : 'desc'
				}
			}
		},
		onLoad: function(e) {
			// #ifndef MP-WEIXIN
			this.statusBarHeight = uni.getSystemInfoSync().statusBarHeight
			// #endif
			// 如果不是微信小程序平台，则获取状态栏高度 并设置自定义导航栏高度要加上状态栏的高度
			// 状态栏的高度*2 是因为获取的这个高度值的单位是 px  转成 upx单位 需要*2
			// 另外 这里获取的状态栏高度 应该和css中的变量 var(--status-bar-height) 是相同的值
			this.navbarHeight = this.navbarHeight + this.statusBarHeight * 2
			
			if (e.keyword) {
				this.keyword = e.keyword
				this.getData()
			}
		},
		onNavigationBarSearchInputConfirmed: function() {
			console.log('onNavigationBarSearchInputConfirmed');
			this.search()
		},
		// 触底则加载下一页数据
		onReachBottom: function() {
			if (this.loadtext !== PULLLOADMORE) return
			this.loadtext = LOADING
			this.page++
			this.getData(false, (res) => {
				if (res) {
					uni.showToast({title: '加载成功', icon: 'none'});
				} else {
					// 加载失败则还原页数
					this.page = this.page - 1
					uni.showToast({title: '加载失败，请重试', icon: 'none'});
				}
			})
		},
		methods: {
			searchBtnClick: function() {
				this.search()
			},
			goback: function() {
				uni.navigateBack({delta: 1})
			},
			
			// 请求接口 获取搜索结果数据
			async getData(refresh = true, callback = false) {
				if (refresh) {
					// 如果页面需要刷新 则清空页数和已经加载的数据
					this.page = 1
					this.list = []
					this.searching = true
				}
				let paras = {
					title: this.keyword,
					page: this.page,
					...this.options,
					...this.condition
				}
				let res = await this.$api.post("/goods/search", paras)
				
				if (refresh) this.searching = false
				if (res) {
					let list = this.formatData(res)
					this.list = [...this.list, ...list]
					// 恢复加载状态
					this.loadtext = list.length < 10? NOMORE : PULLLOADMORE
					
					if (typeof callback === 'function') callback(true)
				} else {
					if (typeof callback === 'function') {
						callback(false)
					} else {
						uni.showToast({title: '搜索失败，请重试', icon: 'none'});
					}
				}
			},
			formatData: function(res) {
				return res.map(item => {
					// 计算好评率
					let good_rating = item.comments_count === 0? '0.00%' : ((item.comments_good_count / item.comments_count) * 100).toFixed(2) + "%"
					return {
						id: item.id,
						title: item.title,
						titlepic: item.cover,
						desc: item.desc,
						pprice: item.min_price,
						comment_num: item.comments_count,
						good_num: good_rating
					}
				})
			},
			changeScreen: function(index) {
				let oldIndex = this.screen.currentIndex
				let oldItem  = this.screen.list[oldIndex]
				let newItem  = this.screen.list[index]
				
				if (oldIndex === index) {
					newItem.status = newItem.status === 1 ? 2 : 1
				} else {
					oldItem.status = 0
					this.screen.currentIndex = index
					newItem.status = 1
				}
				this.getData()
			},
			// 打开条件筛选抽屉
			showDrawer: function() {
				this.showRigth = true
				// 记录旧的选中项索引
				this.label.oldSelected = this.label.selected
			},
			// 提交筛选条件
			drawerConfirm: function() {
				this.getCondition()
				this.getData()
				this.showRigth = false
			},
			// 通过点击蒙版区域关闭抽屉
			closeDrawer: function() {
				// 恢复原来选中的筛选项
				this.label.selected = this.label.oldSelected
				this.showRigth = false
				this.label.oldSelected = 0
			},
			// 重置筛选条件
			drawerReset: function() {
				this.condition = {}
				this.label.selected = 0
				this.getData()
				this.showRigth = false
			},
			// 组织筛选条件
			getCondition: function() {
				let item = this.label.list[this.label.selected]
				if (item.rule === "") {
					this.condition = {}
					return
				}
				this.condition = {
					price: item.rule + ',' + item.value 
				}
			},
			// 搜索之前的相关初始化处理
			initSearch: function() {
				this.label.selected = 0
				this.condition = {}
			},
			// 搜索
			search: function() {
				if (this.keyword === '') {
					return uni.showToast({title: '请输入关键字', icon: 'none'});
				}
				// 隐藏软键盘
				// #ifdef APP-PLUS
				plus.key.hideSoftKeybord()
				// #endif
				// #ifndef APP-PLUS
				uni.hideKeyboard()
				// #endif
				
				this.addHistory()
				this.initSearch()
				// 开始搜索
				this.getData()
			},
			addHistory: function() {
				let history = uni.getStorageSync('searchHistory')
				history = history? JSON.parse(history) : []
				
				let index = history.indexOf(this.keyword)
				// 不存在则加入
				if (index === -1) {
					history.unshift(this.keyword)
				} else {
					// 存在但不在历史记录列表的最前面则移到最前面
					if (index !== 0) {
						history.splice(index, 1)
						history.unshift(this.keyword)
					}
				}
				// 超过6条之后 移除最后面的一个 保持搜索历史中最多只有6条记录
				if (history.length > 6) {
					history.splice(history.length - 1, 1)
				}
				uni.setStorageSync('searchHistory', JSON.stringify(history))
			}
		}
	}
</script>

<style scoped>
.uni-status-bar {
	display: block;
	width: 100%;
	height: 20px;
	height: var(--status-bar-height);
}
</style>

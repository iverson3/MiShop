<template>
	<view>
		<!-- #ifdef MP -->
		<!-- 顶部的自定义导航栏 -->
		<view class="w-100 d-flex a-center" style="height: 90upx;">
			<view style="width: 85upx;" class="d-flex a-center j-center" @click="openMessage">
				<text class="iconfont icon-xiaoxi"></text>
			</view>
			<view class="flex-1 bg-light rounded d-flex a-center text-light-muted" 
			@click="openSearch"
			style="height: 65upx;">
				<text class="iconfont icon-sousuo mx-2"></text>
				kamake ukulele
			</view>
			<view style="width: 85upx;" class="d-flex a-center j-center">
				<text class="iconfont icon-richscan_icon"></text>
			</view>
		</view>
		<!-- #endif -->
		
		
		<!-- 顶部选项卡 -->
		<scroll-view scroll-x 
		:scroll-into-view="scrollinto"
		:scroll-with-animation="true"
		class="border-bottom scroll-row" 
		style="height: 80upx;">
			<view class="scroll-row-item px-3" @click="changeTab(index)"
			style="height: 80upx; line-height: 80upx;" 
			v-for="(item,index) in tabBars" :key="index"
			:class="tabIndex === index ? 'main-text-color' : ''"
			:id="'tab' + index">
				<text class="font-md">{{ item.name }}</text>
			</view>
		</scroll-view>
		<swiper :duration="150" 
		@change="onChangeTab"
		:current="tabIndex" 
		:style="'height:' + scrollH + 'px;'">
			<swiper-item v-for="(item,index) in newsitems" :key="index">
				<scroll-view @scrolltolower="loadmore" scroll-y :style="'height:' + scrollH + 'px;'"> 
					
					<template v-if="item.list.length > 0 && item.firstLoad === 'after'">
						<block v-for="(list,listIndex) in item.list" :key="listIndex">
							<!-- 轮播图组件 -->
							<swiper-image v-if="list.type === 'swiper'" :resdata="list.data"></swiper-image>
							
							<template v-else-if="list.type === 'indexnav'">
								<!-- 首页分类组件 -->
								<index-nav :resdata="list.data"></index-nav>
								<!-- 全局分割线组件 -->
								<divider></divider>
							</template>
							
							<template v-else-if="list.type === 'threeAdv'">
								<!-- 三图广告 -->
								<three-adv :resdata="list.data"></three-adv>
								<!-- 全局分割线组件 -->
								<divider></divider>
							</template>
							
							<!-- 大图广告位 -->
							<!-- <card headTitle="每日精选" bodyCover="/static/images/demo/demo4.jpg"></card> -->
							
							<!-- 公共列表组件 左右w:372.5 间距w:5 -->
							<view class="row j-sb" v-else-if="list.type === 'list'">
								<block v-for="(item2,index2) in list.data" :key="index2">
									<common-list :item="item2" :index="index2"></common-list>
								</block>
							</view>
						</block>
						
						<!-- 上拉加载更多 -->
						<divider></divider>
						<view class="d-flex a-center j-center text-light-muted font-md py-3">
							{{ item.loadtext }}
						</view>
					</template>
					
					<template v-else-if="item.firstLoad === 'ing'">
						<view class="w-100 d-flex j-center a-center" style="padding-top: 150upx;">
							<text class="font-md text-light-muted">数据加载中...</text>
						</view>
					</template>
					
					<!-- tab下没有数据 -->
					<template v-else>
						<view class="w-100 d-flex j-center a-center" style="padding-top: 150upx;">
							<text class="font-md text-light-muted">暂无数据</text>
						</view>
					</template>
					
				</scroll-view>
			</swiper-item>
		</swiper>
		
	</view>
</template>

<script>
	// 三种状态显示的文字
	const PULLLOADMORE = '上拉加载更多'
	const LOADING = '加载中...'
	const NOMORE = '没有更多了'
	
	import swiperImage from '@/components/index/swiper-image.vue'
	import indexNav from '@/components/index/index-nav.vue'
	import threeAdv from '@/components/index/three-adv.vue'
	import card from '@/components/common/card.vue'
	import commonList from '@/components/common/common-list.vue'
	
	export default {
		components: {
			swiperImage,
			indexNav,
			threeAdv,
			card,
			commonList
		},
		data() {
			return {
				scrollinto: "",
				scrollH: 500,
				tabIndex: 0,
				tabBars: [],
				newsitems: []
			}
		},
		onLoad() {
			// 获取手机屏幕可视区域高度
			uni.getSystemInfo({
				success: (res) => {
					let navbarH = 0
					// #ifndef MP
					navbarH = 0
					// #endif
					// 在小程序平台下 有一个高90的自定义导航栏
					// #ifdef MP
					navbarH = uni.upx2px(90)
					// #endif
					this.scrollH = res.windowHeight - uni.upx2px(82) - navbarH;
				}
			})
			// 初始化事件
			this.__init()
		},
		methods: {
			async __init() {
				let data = await this.$api.get('/index_category/data')
				console.log(data)
				if (data) {
					// 初始化tabbar数据
					this.tabBars = data.category
					// 初始化页面数据
					// 根据顶部选项卡生成对应页面
					let arr = []
					for (var i = 0; i < this.tabBars.length; i++) {
						let obj = {
							list: [],
							// 三个状态：上拉加载更多/加载中.../没有更多了 (上面定义了对应的常量)
							loadtext: PULLLOADMORE,
							// 首次加载状况：before ing after
							firstLoad: i === 0 ? 'after' : 'before'
						}
						// 获取首屏数据
						if (i === 0) obj.list = data.data
						arr.push(obj)
					}
					this.newsitems = arr
				}
			},
			async addData(callback = false) {
				let index = this.tabIndex;
				let obj = this.newsitems[index]
				
				let id   = this.tabBars[index].id
				let page = Math.ceil(obj.list.length / 5) + 1;  // api每次返回5条数据
				if (page === 1) {
					// 当前tab下的首次数据加载中
					obj.firstLoad = 'ing'
				}
				// 执行api请求
				let data = await this.$api.get('/index_category/'+ id +'/data/' + page)
				if (page === 1) {
					// 当前tab下的首次数据加载完成
					obj.firstLoad = 'after'
				}
				console.log(data)
				if (data) {
					// 合并数据
					obj.list = [...obj.list, ...data];
					
					if (typeof callback === 'function') callback(true)
					// api数据接口每次返回5条数据 如果不足5条 则说明没有更多数据了
					obj.loadtext = data.length < 5 ? NOMORE : PULLLOADMORE;
				} else {
					if (page === 1) {
						// 首次加载数据失败，则还原状态字段
						obj.firstLoad = 'before'
					} else {
						// 加载更多数据失败，则还原对应的加载提示信息
						obj.loadtext = PULLLOADMORE;
					}
					if (typeof callback === 'function') callback(false)
				}
			},
			
			loadmore: function() {
				let index = this.tabIndex
				let item  = this.newsitems[index]
				// 判断是否处于可加载状态
				if (item.loadtext !== PULLLOADMORE) return;
				// 模拟请求api接口 获取对应的更多数据
				item.loadtext = LOADING
				this.addData((res) => {
					if (res) {
						uni.showToast({title: '加载成功', icon: 'none'});
					} else {
						uni.showToast({title: '加载失败', icon: 'none'});
					}
				})
			},
			
			changeTab: function(index) {
				if (this.tabIndex === index) return
				
				this.tabIndex = index
				this.scrollinto = 'tab' + index
				if (this.newsitems[index].firstLoad === 'before') {
					// 调用接口 获取数据
					this.addData()
				}
			},
			// 监听滑动列表的滑动
			onChangeTab: function(e) {
				this.changeTab(e.detail.current)
			},
			
			openSearch: function() {
				uni.navigateTo({
					url: '/pages/search/search'
				})
			},
			openMessage: function() {
				// 需要验证用户权限的跳转使用 this.navigateTo()
				// 不需要验证用户权限的跳转使用 uni.navigateTo()
				this.navigateTo({
					url: "/pages/msg-list/msg-list"
				})
			}
		}
	}
</script>

<style>
	
</style>

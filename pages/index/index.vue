<template>
	<view>
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
				</scroll-view>
			</swiper-item>
		</swiper>
		
	</view>
</template>

<script>
	// 模拟从服务器端获取的数据
	let demoTabBars = [
		{
			name: "推荐"
		},
		{
			name: "关注"
		},
		{
			name: "体育"
		},
		{
			name: "热点"
		},
		{
			name: "财经"
		},
		{
			name: "娱乐"
		},
		{
			name: "军事"
		},
		{
			name: "历史"
		},
		{
			name: "本地"
		}
	];
	
	let demo1 = [
		{
			type: "swiper",
			data: [
				{src: "../../static/images/demo/demo4.jpg"},
				{src: "../../static/images/demo/demo4.jpg"},
				{src: "../../static/images/demo/demo4.jpg"}
			]
		},
		{
			type: "indexnav",
			data: [
				{
					src: "/static/images/indexnav/1.png",
					text: "新品发布"
				},
				{
					src: "/static/images/indexnav/2.gif",
					text: "小米众筹"
				},
				{
					src: "/static/images/indexnav/3.gif",
					text: "以旧换新"
				},
				{
					src: "/static/images/indexnav/4.gif",
					text: "一分换团"
				},
				{
					src: "/static/images/indexnav/5.gif",
					text: "超值特卖"
				},
				{
					src: "/static/images/indexnav/6.gif",
					text: "小米秒杀"
				},
				{
					src: "/static/images/indexnav/7.gif",
					text: "真心想要"
				},
				{
					src: "/static/images/indexnav/8.gif",
					text: "电视热卖"
				},
				{
					src: "/static/images/indexnav/9.gif",
					text: "家电热卖"
				},
				{
					src: "/static/images/indexnav/10.gif",
					text: "米粉卡"
				}
			]
		},
		{
			type: "threeAdv",
			data: {
				big: {
					src: "/static/images/demo/demo1.jpg"
				},
				smalltop: {
					src: "/static/images/demo/demo2.jpg"
				},
				smallbottom: {
					src: "/static/images/demo/demo3.jpg"
				}
			}
		},
		{
			type: "list",
			data: [
				{
					cover: "/static/images/demo/list/1.jpg",
					title:"米家空调",
					desc: "1.5匹变频",
					oprice:2699,
					pprice:1389
				},
				{
					cover: "/static/images/demo/list/1.jpg",
					title:"米家空调",
					desc: "1.5匹变频",
					oprice:2699,
					pprice:1389
				},
				{
					cover: "/static/images/demo/list/1.jpg",
					title:"米家空调",
					desc: "1.5匹变频",
					oprice:2699,
					pprice:1389
				},
				{
					cover: "/static/images/demo/list/1.jpg",
					title:"米家空调",
					desc: "1.5匹变频",
					oprice:2699,
					pprice:1389
				}
			]
		}
	];
	let demo2 = [
		{
			type: "swiper",
			data: [
				{src: "../../static/images/demo/demo4.jpg"},
				{src: "../../static/images/demo/demo4.jpg"},
				{src: "../../static/images/demo/demo4.jpg"}
			]
		},
		{
			type: "indexnav",
			data: [
				{
					src: "/static/images/indexnav/1.png",
					text: "新品发布"
				},
				{
					src: "/static/images/indexnav/2.gif",
					text: "小米众筹"
				},
				{
					src: "/static/images/indexnav/3.gif",
					text: "以旧换新"
				},
				{
					src: "/static/images/indexnav/4.gif",
					text: "一分换团"
				},
				{
					src: "/static/images/indexnav/5.gif",
					text: "超值特卖"
				},
				{
					src: "/static/images/indexnav/6.gif",
					text: "小米秒杀"
				},
				{
					src: "/static/images/indexnav/7.gif",
					text: "真心想要"
				},
				{
					src: "/static/images/indexnav/8.gif",
					text: "电视热卖"
				},
				{
					src: "/static/images/indexnav/9.gif",
					text: "家电热卖"
				},
				{
					src: "/static/images/indexnav/10.gif",
					text: "米粉卡"
				}
			]
		},
		{
			type: "list",
			data: [
				{
					cover: "/static/images/demo/list/1.jpg",
					title:"米家空调",
					desc: "1.5匹变频",
					oprice:2699,
					pprice:1389
				},
				{
					cover: "/static/images/demo/list/1.jpg",
					title:"米家空调",
					desc: "1.5匹变频",
					oprice:2699,
					pprice:1389
				},
				{
					cover: "/static/images/demo/list/1.jpg",
					title:"米家空调",
					desc: "1.5匹变频",
					oprice:2699,
					pprice:1389
				},
				{
					cover: "/static/images/demo/list/1.jpg",
					title:"米家空调",
					desc: "1.5匹变频",
					oprice:2699,
					pprice:1389
				}
			]
		}
	];
	
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
					this.scrollH = res.windowHeight - uni.upx2px(82);
				}
			})
			
			// 初始化事件
			this.__init()
		},
		methods: {
			__init: function() {
				// 获取顶部选项卡
				this.tabBars = demoTabBars
				// 根据顶部选项卡生成对应页面
				let arr = []
				for (var i = 0; i < this.tabBars.length; i++) {
					let obj = {
						list: [],
						// 三个状态：上拉加载更多/加载中.../没有更多了 (上面定义了对应的常量)
						loadtext: PULLLOADMORE
					}
					// 获取首屏数据
					if (i === 0) {
						obj.list = demo1
					}
					arr.push(obj)
				}
				this.newsitems = arr
				console.log(this.newsitems)
			},
			addData: function() {
				let index = this.tabIndex;
				// 请求api接口 获取对应选项卡内的数据
				this.newsitems[index].list = demo2
			},
			
			loadmore: function() {
				let index = this.tabIndex
				let item  = this.newsitems[index]
				// 判断是否处于可加载状态
				if (item.loadtext !== PULLLOADMORE) return;
				// 模拟请求api接口 获取对应的更多数据
				item.loadtext = LOADING
				setTimeout(() => {
					// 组装数据
					item.list = [...item.list, ...demo2]
					item.loadtext = PULLLOADMORE
				}, 2000)
			},
			
			changeTab: function(index) {
				if (this.tabIndex === index) {
					return;
				}
				this.tabIndex = index
				this.scrollinto = 'tab' + index
				// 调用接口 获取数据
				this.addData()
			},
			// 监听滑动列表的滑动
			onChangeTab: function(e) {
				this.changeTab(e.detail.current)
			}
		}
	}
</script>

<style>
	
</style>

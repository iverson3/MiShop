<template>
	<view>
		
		<!-- 商品详情大图 -->
		<swiper-image :resdata="banners" :height="750" :preview="true"></swiper-image>
		
		<!-- 商品基础信息 -->
		<base-info :detail="detail"></base-info>
		
		<!-- 滚动商品特性 -->
		<scroll-attrs :baseAttrs="baseAttrs"></scroll-attrs>
		
		<!-- 属性选择 -->
		<view class="p-2">
			<view class="rounded border bg-light-secondary">
				<uni-list-item @tap="showPopup('attr')">
					<view class="d-flex">
						<text class="mr-2 text-muted">已选</text>
						<text>火焰红 64G 标配</text>
					</view>
				</uni-list-item>
				<uni-list-item @tap="showPopup('express')">
					<view class="d-flex">
						<text class="mr-2 text-muted">配送</text>
						<text class="mr-2">北京 东城区</text>
						<text class="main-text-color">现配</text>
					</view>
				</uni-list-item>
				<uni-list-item extraWidth="15%" @tap="showPopup('service')">
					<view class="d-flex a-center">
						<view class="text-muted font d-flex a-center mr-2">
							<view class="iconfont icon-finish main-text-color"></view>
							小米自营
						</view>
						<view class="text-muted font d-flex a-center mr-2">
							<view class="iconfont icon-finish main-text-color"></view>
							小米发货
						</view>
						<view class="text-muted font d-flex a-center mr-2">
							<view class="iconfont icon-finish main-text-color"></view>
							七天无理由退货
						</view>
					</view>
				</uni-list-item>
			</view>
		</view>
		
		<!-- 横向滚动评论 -->
		<scroll-comments :comments="comments"></scroll-comments>
		
		<!-- 商品详情 -->
		<view class="py-4">
			<u-parse className="uparse" :content="context" @preview="preview" @navigate="navigate"></u-parse>
		</view>
		
		<!-- 热门推荐 -->
		<card headTitle="热门推荐" :headTitleWeight="false" :headBorderBottom="false">
			<view class="row j-sb">
				<common-list v-for="(item,index) in hotList" :key="index" :item="item" :index="index"></common-list>
			</view>
		</card>
		
		<!-- 底部操作条 -->
		<bottom-btn @showAttrPopup="showPopup('attr')"></bottom-btn>
		
		
		<!-- 属性筛选弹出框 -->
		<common-popup :popupClass="popup.attr" @hide="hidePopup('attr')">
			<!-- 
			商品信息 h275
			图片 180*180
			 -->
			<view class="d-flex a-center" style="height: 275upx;">
				<image src="../../static/images/demo/list/1.jpg" 
				style="width: 180upx;height: 180upx;"
				class="border rounded"
				mode="widthFix"></image>
				<view class="pl-2">
				 	<price priceSize="font-lg" unitSize="font">2365</price>
					<text class="d-block">火焰红 64G 标配</text>
				</view>
			</view>
			 
			<!-- 表单部分 h660 -->
			<scroll-view scroll-y class="w-100" style="height: 660upx;">
			 	<card :headTitle="item.title" 
				v-for="(item,index) in selects"
				:key="index"
				:headTitleWeight="false" 
				:headBorderBottom="false">
					<mi-radio-group :label="item" :selected.sync="item.selected"></mi-radio-group>
				</card>
				<view class="d-flex j-sb a-center p-2 border-top border-light-secondary">
					<text>购买数量</text>
					<uni-number-box :value="detail.num" :min="1" :max="detail.max" @change="detail.num = $event"></uni-number-box>
				</view>
			</scroll-view>
			 
			<!-- 按钮 h100 -->
			<view class="main-bg-color text-white font-md d-flex j-center a-center"
			hover-class="main-bg-hover-color"
			@tap.stop="addCart"
			style="height: 100upx;margin-left: -30upx;margin-right: -30upx;">
				加入购物车
			</view>
		</common-popup>
		
		<!-- 收货地址选择弹出框 -->
		<common-popup :popupClass="popup.express" @hide="hidePopup('express')">
			<view class="d-flex a-center j-center font-md border-bottom border-light-secondary" style="height: 100upx;">
				收货地址
			</view>
			 
			<!-- 地址列表 h660 -->
			<scroll-view scroll-y class="w-100" style="height: 835upx;">
			 	<uni-list-item v-for="(item,index) in pathList" :key="index">
					<view class="iconfont icon-dingwei font-weight font-md">{{ item.name }}</view>
					<view class="font text-light-muted">
						{{ item.path }} {{ item.detailPath }}
					</view>
				</uni-list-item>
			</scroll-view>
			 
			<!-- 按钮 h100 -->
			<view class="main-bg-color text-white font-md d-flex j-center a-center"
			hover-class="main-bg-hover-color"
			@tap.stop="openCreatePath"
			style="height: 100upx;margin-left: -30upx;margin-right: -30upx;">
				选择新地址
			</view>
		</common-popup>
		
		<!-- 服务说明弹出框 -->
		<common-popup :popupClass="popup.service" @hide="hidePopup('service')">
			<view class="d-flex a-center j-center font-md border-bottom border-light-secondary" style="height: 100upx;">
				服务说明
			</view>
			 
			<!-- 服务说明列表 h660 -->
			<scroll-view scroll-y class="w-100" style="height: 835upx;">
			 	<view class="py-1">
			 		<view class="d-flex a-center">
						<view class="iconfont icon-finish main-text-color mr-1"></view>
						小米自营
					</view>
					<view class="text-light-muted font pl-4">不管满多少，就是不包邮</view>
			 	</view>
				<view class="py-1">
					<view class="d-flex a-center">
						<view class="iconfont icon-finish main-text-color mr-1"></view>
						7天无忧退换
					</view>
					<view class="text-light-muted font pl-4">自购买之日起，七天内可以无理由退换货</view>
				</view>
			</scroll-view>
			 
			<!-- 按钮 h100 -->
			<view class="main-bg-color text-white font-md d-flex j-center a-center"
			hover-class="main-bg-hover-color"
			@tap.stop="hidePopup('service')"
			style="height: 100upx;margin-left: -30upx;margin-right: -30upx;">
				确定
			</view>
		</common-popup>
		
	</view>
</template>

<script>
	import swiperImage from '@/components/index/swiper-image.vue'
	import baseInfo from '@/components/detail/base-info.vue'
	import scrollAttrs from '@/components/detail/scroll-attrs.vue'
	import uniListItem from '@/components/uni-ui/uni-list-item/uni-list-item.vue'
	import scrollComments from '@/components/detail/scroll-comments.vue'
	import uParse from '@/components/uni-ui/uParse/src/wxParse.vue'
	import card from '@/components/common/card.vue'
	import commonList from '@/components/common/common-list.vue'
	import bottomBtn from '@/components/detail/bottom-btn.vue'
	import commonPopup from '@/components/common/common-popup.vue'
	import price from '@/components/common/price.vue'
	import miRadioGroup from '@/components/common/mi-radio-group.vue'
	import uniNumberBox from '@/components/uni-ui/uni-number-box/uni-number-box.vue'

var htmlString = `
	<p>
		<img src="https://i8.mifile.cn/v1/a1/9c3e29dc-151f-75cb-b0a5-c423a5d13926.webp">
		<img src="https://i8.mifile.cn/v1/a1/f442b971-379f-5030-68aa-3b0accb8c2b9.webp">
		<img src="https://i8.mifile.cn/v1/a1/63b700b6-643e-ec18-fdf3-da66b4b4173f.webp">
		<img src="https://i8.mifile.cn/v1/a1/e9dbf276-193e-11c4-99a6-3097fde82350.webp">
		<img src="https://i8.mifile.cn/v1/a1/1249d3ee-2990-a2b4-28d9-f719c2417b1f.webp">
		<img src="https://i8.mifile.cn/v1/a1/97c79915-64b2-808c-53b4-4345652a179f.webp">
		<img src="https://i8.mifile.cn/v1/a1/cd0fbe1e-a1b3-a87a-f4a6-6fb08ec54931.webp">
	</p>
	    `


	import {mapState, mapMutations} from 'vuex'
	export default {
		components: {
			swiperImage,
			baseInfo,
			scrollAttrs,
			uniListItem,
			scrollComments,
			uParse,
			card,
			commonList,
			bottomBtn,
			commonPopup,
			price,
			miRadioGroup,
			uniNumberBox
		},
		data() {
			return {
				popup: {
					attr: "none",
					express: "none",
					service: "none"
				},
				
				banners: [
					{ src: "/static/images/demo/demo9.jpg" },
					{ src: "/static/images/demo/demo10.jpg" }
				],
				
				detail: {
					id: 5,
					title: "小米MIX3 6GB+128GB",
					cover: "/static/images/demo/list/1.jpg",
					desc: "磁动力滑盖全面屏 / 前后旗舰AI双摄 / 四曲面彩色陶瓷机身 / 高效10W无限充电",
					pprice: 3299,
					num: 1,
					max: 102
				},
				context: htmlString,
				
				baseAttrs: [
					{icon: "icon-cpu", title: "CPU", desc: "晓龙845八核"},
					{icon: "icon-cpu", title: "CPU", desc: "晓龙845八核"},
					{icon: "icon-cpu", title: "CPU", desc: "晓龙845八核"},
					{icon: "icon-cpu", title: "CPU", desc: "晓龙845八核"},
					{icon: "icon-cpu", title: "CPU", desc: "晓龙845八核"},
					{icon: "icon-cpu", title: "CPU", desc: "晓龙845八核"},
					{icon: "icon-cpu", title: "CPU", desc: "晓龙845八核"},
					{icon: "icon-cpu", title: "CPU", desc: "晓龙845八核"}
				],
				
				selects: [
					{
						title: "颜色",
						selected: 0,
						list: [
							{name: '黄色'},
							{name: '黑色'},
							{name: '红色'}
						]
					},
					{
						title: "容量",
						selected: 0,
						list: [
							{name: '64GB'},
							{name: '128GB'}
						]
					},
					{
						title: "套餐",
						selected: 0,
						list: [
							{name: '标配'},
							{name: '套餐一'},
							{name: '套餐二'}
						]
					},
				],
				
				comments: [
					{
						userpic: "/static/images/demo/demo6.jpg",
						username: "楚棉",
						create_time: "2019-08-12",
						goods_num: 126,
						context: "评论内容评论内容，评论内容评论内，评论内容评论内，评论内容评论内，评论内容评论内,评论内容评论内,评论内容评论内，容评论内容，评论内容，评论内容评论评论内容评论内容",
						imglist: [
							"/static/images/demo/demo6.jpg",
							"/static/images/demo/demo6.jpg",
							"/static/images/demo/demo6.jpg"
						]
					},
					{
						userpic: "/static/images/demo/demo6.jpg",
						username: "楚棉",
						create_time: "2019-08-12",
						goods_num: 126,
						context: "评论内容评论内容评论内容评论内容评论内容评论内容评论内容评论评论内容评论内容",
						imglist: [
							"/static/images/demo/demo6.jpg",
							"/static/images/demo/demo6.jpg",
							"/static/images/demo/demo6.jpg"
						]
					},
					{
						userpic: "/static/images/demo/demo6.jpg",
						username: "楚棉",
						create_time: "2019-08-12",
						goods_num: 126,
						context: "评论内容评论，内容评论内容评论内容，评论内容评，论内容评论内容评论，评论内容评论内容",
						imglist: [
							"/static/images/demo/demo6.jpg",
							"/static/images/demo/demo6.jpg",
							"/static/images/demo/demo6.jpg"
						]
					}
				],
				hotList: [
					{
						cover:"/static/images/demo/list/1.jpg",
						title:"米家空调",
						desc:"1.5匹变频",
						oprice:2699,
						pprice:1399
					},
					{
						cover:"/static/images/demo/list/1.jpg",
						title:"米家空调",
						desc:"1.5匹变频",
						oprice:2699,
						pprice:1399
					},
					{
						cover:"/static/images/demo/list/1.jpg",
						title:"米家空调",
						desc:"1.5匹变频",
						oprice:2699,
						pprice:1399
					},
					{
						cover:"/static/images/demo/list/1.jpg",
						title:"米家空调",
						desc:"1.5匹变频",
						oprice:2699,
						pprice:1399
					},
					{
						cover:"/static/images/demo/list/1.jpg",
						title:"米家空调",
						desc:"1.5匹变频",
						oprice:2699,
						pprice:1399
					},
					{
						cover:"/static/images/demo/list/1.jpg",
						title:"米家空调",
						desc:"1.5匹变频",
						oprice:2699,
						pprice:1399
					}
				]
			}
		},
		computed: {
			...mapState({
				pathList: state => state.path.list
			})
		},
		
		// 监听页面返回事件
		onBackPress: function() {
			for (let key in this.popup) {
				// 遍历弹出框状态，判断是否有弹出框处于弹出状态
				if (this.popup[key] !== 'none') {
					this.hidePopup(key)  // 关闭弹出框
					return true          // 阻止页面的返回
				}
			}
			return false  // 让页面正常返回
		},
		methods: {
			...mapMutations([
				'addGoodsToCart'
			]),
			addCart: function() {
				let goods = this.detail
				
				goods['checked'] = false
				goods['attrs'] = this.selects
				// 加入购物车
				this.addGoodsToCart(goods)
				// 隐藏属性选择弹出框
				this.hidePopup('attr')
				// 加入成功提示
				uni.showToast({title: "加入成功"})
			},
			openCreatePath: function() {
				uni.navigateTo({
					url: "/pages/user-path-edit/user-path-edit"
				})
				this.hidePopup('express')
			},
			hidePopup: function(key) {
				this.popup[key] = "hide"
				setTimeout(() => {
					this.popup[key] = "none"
				}, 200)
			},
			showPopup: function(key) {
				this.popup[key] = "show"
			},
			
			// 详情信息中的图片预览处理
			preview(src, e) {
				// do something
				console.log("src: " + src);
			},
			// 详情信息中的链接跳转处理
			navigate(href, e) {
				// 如允许点击超链接跳转，则应该打开一个新页面，并传入href，由新页面内嵌webview组件负责显示该链接内容
				console.log("href: " + href);
				// uni.showModal({
				// 	content : "点击链接为：" + href,
				// 	showCancel:false
				// })
			}
		}
	}
</script>

<style>
/* 解决uParse详情显示组件中图片边距和行高的问题 */
.uparse .p {padding: 0!important;}
.uparse view {line-height: 0!important;}

</style>

<template>
	<view>
		
		<!-- 商品详情大图 -->
		<swiper-image :resdata="banners" :height="750" :preview="true"></swiper-image>
		
		<!-- 商品基础信息 -->
		<base-info :detail="detail" :show-price="showPrice"></base-info>
		
		<!-- 滚动商品特性 -->
		<scroll-attrs :baseAttrs="baseAttrs"></scroll-attrs>
		
		<!-- 属性选择 -->
		<view class="p-2">
			<view class="rounded border bg-light-secondary">
				<uni-list-item @tap="showPopup('attr')">
					<view class="d-flex">
						<text class="mr-2 text-muted">已选</text>
						<text>{{ checkedSkus }}</text>
					</view>
				</uni-list-item>
				<uni-list-item @tap="showPopup('express')">
					<view class="d-flex">
						<text class="mr-2 text-muted">配送</text>
						<text class="mr-2">{{ defaultPathCity }}</text>
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
		<scroll-comments :goods_id="detail.id" :comments="comments"></scroll-comments>
		
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
		<bottom-btn :goods_id="detail.id" @showAttrPopup="showPopup('attr')"></bottom-btn>
		
		
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
				 	<price priceSize="font-lg" unitSize="font">{{ showPrice }}</price>
					<text class="d-block">{{ checkedSkus }}</text>
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
					<uni-number-box :value="detail.num" :min="1" :max="maxStock" @change="detail.num = $event"></uni-number-box>
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
					<view class="iconfont icon-dingwei font-weight font-md">
						{{ item.name }}
						<text class="ml-2">{{ item.phone }}</text> 
						<text v-if="item.isdefault" class="ml-3" style="color: red;">[默认]</text>
					</view>
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

	import {mapState, mapMutations, mapGetters} from 'vuex'
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
				// 轮播图数据
				banners: [],
				
				detail: {},
				context: "",
				baseAttrs: [],
				selects: [],
				
				comments: [],
				hotList: []
			}
		},
		computed: {
			...mapState({
				pathList: state => state.path.list
			}),
			...mapGetters([
				'defaultPathCity'
			]),
			
			// 最大库存根据多规格属性的改变进行动态的改变
			maxStock() {
				if (!this.detail.goodsSkus) return 0
				if (this.checkedSkusIndex < 0) return this.detail.min_stock
				return this.detail.goodsSkus[this.checkedSkusIndex].stock || 100
			},
			
			// 拿到选中的skus组成的多规格字符串
			checkedSkus() {
				let checkedSkus = this.selects.map(v => {
					return v.list[v.selected].name
				})
				return checkedSkus.join(",")
			},
			// 选中的多规格属性组 对应在价格对照表中的索引
			checkedSkusIndex() {
				let index = 0
				if (this.detail.goodsSkus) {
					index = this.detail.goodsSkus.findIndex((item) => {
						return item.skusText === this.checkedSkus
					})
				}
				return index
			},
			// 根据多规格属性的选择而动态计算的价格
			showPrice() {
				if (this.checkedSkusIndex < 0) return this.detail.min_price || 0.00
				if (!this.detail.goodsSkus) return 0.00
				return this.detail.goodsSkus[this.checkedSkusIndex].pprice
			}
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
		onLoad: function(e) {
			if (e.goods_id) {
				this.__init(e.goods_id)
			}
		},
		methods: {
			...mapMutations([
				'addGoodsToCart'
			]),
			async __init(goods_id) {
				let res = await this.$api.get('/goods/' + goods_id)
				if (res) {
					// 轮播图
					this.banners = res.goodsBanner.map(v => {
						return {
							src: v.url
						}
					})
					// 商品基本信息
					/*
						id: 5,
						title: "小米MIX3 6GB+128GB",
						cover: "/static/images/demo/list/1.jpg",
						desc: "磁动力滑盖全面屏 / 前后旗舰AI双摄 / 四曲面彩色陶瓷机身 / 高效10W无限充电",
						pprice: 3299,
						num: 1,
						max: 102
					*/
					this.detail = res
					this.detail.num = 1
					
					// 临时解决测试数据商品id相同的问题
					// let rand1 = Math.floor(Math.random() * (10 - 1)) + 1
					// let rand2 = Math.floor(Math.random() * (20 - 1)) + 1
					// this.detail.id = this.detail.id * rand1 + rand2
					
					// 设置页面标题
					uni.setNavigationBarTitle({
						title: res.title
					})
					// 滚动商品属性
					this.baseAttrs = res.goodsAttrs.map(v => {
						return {
							icon: "icon-cpu",
							title: v.name,
							desc: v.value
						}
					})
					// 热门评论
					this.comments = res.hotComments.map(v => {
						return {
							id: v.id,
							user_id: v.user.id,
							userpic: v.user.avatar,
							username: v.user.nickname,
							create_time: v.review_time,
							goods_num: v.goods_num,
							context: v.review.data,
							imglist: v.review.image
						}
					})
					// 商品详情
					this.context = res.content
					// 热门推荐
					this.hotList = res.hotList.map(v => {
						return {
							id: v.id,
							cover: v.cover,
							title: v.title,
							desc: v.desc,
							oprice: v.min_oprice,
							pprice: v.min_price
						}
					})
					// 商品多规格弹出框数据
					this.selects = res.goodsSkusCard.map(v => {
						var list = v.goodsSkusCardValue.map(v2 => {
							return {
								id: v2.id,
								name: v2.value
							}
						})
						return {
							id: v.id,
							title: v.name,
							selected: 0,
							list: list
						}
					})
					// 商品多规格 匹配价格
					this.detail.goodsSkus.forEach(item => {
						let arr = []
						for (let key in item.skus) {
							arr.push(item.skus[key].value)
						}
						item.skusText = arr.join(",")
					})
				}
			},
			addCart: function() {
				let goods = this.detail
				
				goods['pprice'] = this.showPrice
				goods['minnum'] = 1
				goods['maxnum'] = this.maxStock
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
				console.log(this.detail);
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

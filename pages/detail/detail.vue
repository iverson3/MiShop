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
				<uni-list-item v-if="detail.sku_type === 1" @tap="showPopup('attr')">
					<view class="d-flex">
						<text class="mr-2 text-muted">已选</text>
						<text>{{ checkedSkus }}</text>
					</view>
				</uni-list-item>
				<uni-list-item @tap="showPopup('express')">
					<view class="d-flex">
						<text class="mr-2 text-muted">配送</text>
						<text class="mr-2">{{ deliveryPath? deliveryPath : defaultPathCity }}</text>
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
		<bottom-btn :goods_id="detail.id" :goodsInfo="goodsInfo" :hasCollect="hasCollect" @changeCollect="changeCollect" @showAttrPopup="showPopup('attr')"></bottom-btn>
		
		
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
			<view class="text-white font-md d-flex j-center a-center"
			:hover-class="maxStock === 0? '' : 'main-bg-hover-color'"
			:class="maxStock === 0? 'bg-secondary' : 'main-bg-color'"
			@tap.stop="addCart"
			style="height: 100upx;margin-left: -30upx;margin-right: -30upx;">
				{{ maxStock === 0? '暂无库存' : '加入购物车' }}
			</view>
		</common-popup>
		
		<!-- 收货地址选择弹出框 -->
		<common-popup :popupClass="popup.express" @hide="hidePopup('express')">
			<view class="d-flex a-center j-center font-md border-bottom border-light-secondary" style="height: 100upx;">
				收货地址
			</view>
			 
			<!-- 地址列表 h660 -->
			<scroll-view scroll-y class="w-100" style="height: 835upx;">
			 	<uni-list-item @tap="changeCurPath(item)" v-for="(item,index) in pathList" :key="index">
					<view class="iconfont icon-dingwei font-weight font-md">
						{{ item.name }}
						<text class="ml-2">{{ item.phone }}</text> 
						<text v-if="item.isdefault" class="ml-3" style="color: red;">[默认]</text>
					</view>
					<view class="font text-light-muted">
						{{ item.province }} {{ item.city }} {{ item.district }} {{ item.address }}
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
				// 详情页用户选择的配送地址，在用户选择之前使用默认地址 defaultPathCity(用户自己的默认收货地址)
				deliveryPath: false, 
				
				comments: [],
				hotList: [],
				
				hasCollect: false,
				goodsInfo: {}
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
				// 判断商品的规格类型： 单规格的商品，不需要动态计算库存，直接返回该商品的库存stock
				if (this.detail.sku_type === 0) {
					return this.detail.stock 
				}
				if (!this.detail.goodsSkus) return 0
				if (this.checkedSkusIndex < 0) return this.detail.min_stock
				return this.detail.goodsSkus[this.checkedSkusIndex].stock
			},
			
			// 拿到选中的skus组成的多规格字符串
			checkedSkus() {
				if (!this.selects || this.selects.length === 0) return ""
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
				// 判断商品的规格类型： 单规格的商品，不需要动态计算价格，直接返回该商品的价格
				if (this.detail.sku_type === 0) {
					return this.detail.min_price
				}
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
			...mapMutations(['addGoodsToCart']),
			
			async __init(goods_id) {
				uni.showLoading({
					title: "商品详情加载中...",
					mask: true
				})
				let res = await this.$api.get('/goods/' + goods_id)
				uni.hideLoading()
				if (res) {
					// 轮播图
					this.banners = res.goodsBanner.map(v => {
						return {
							src: v.url
						}
					})
					// 商品基本信息
					this.detail = res
					this.detail.num = 1
					
					// 注意：只有在detail被赋值了之后才能执行下面的代码来计算商品是否被收藏
					this.hasCollect = this.isCollected()
					this.goodsInfo = {
						id: this.detail.id,
						title: this.detail.title,
						desc: this.detail.desc,
						cover: this.detail.cover,
						pprice: this.detail.min_price
					}
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
					
					// 多规格商品才需要处理多规格数据
					if (this.detail.sku_type === 1) {
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
					
				}
			},
			addCart: function() {
				if (this.maxStock === 0) return;
				if (!this.isLogin()) {
					uni.showToast({title: '请先登录', icon: 'none'});
					uni.navigateTo({url: '/pages/login/login'});
					return
				}
				// 组装post数据
				let data = {
					// 单规格用商品id,多规格则用规格id
					shop_id: this.detail.sku_type === 0? this.detail.id : this.detail.goodsSkus[this.checkedSkusIndex].id,
					skus_type: this.detail.sku_type,
					num: this.detail.num
				}
				uni.showLoading({
					title: "加入中...",
					mask: true
				})
				this.$api.post('/cart', data, {token: true, toast: false}).then(res => {
					uni.hideLoading()
					// 通知购物车进行更新
					// 没有效果 但好像也不需要这个触发更新了
					// this.$emit('updateCart')
					
					let skusTextList = []
					if (res.skus_type === 1) {
						// 获取当前商品选中的多规格和属性
						Object.keys(res.goodsSkus.skus).forEach(function(k){
							skusTextList.push(res.goodsSkus.skus[k].value)
						});
					}
					
					// store中加入购物车列表
					let goods = {}
					goods.title = this.detail.title
					goods.cover = this.detail.cover
					goods.num = this.detail.num
					goods.id = parseInt(res.id)
					goods.skus_type = res.skus_type
					// 多规格商品才有下面两个字段
					if (res.skus_type === 1) {
						goods.shop_id = res.shop_id
						goods.skusText = skusTextList.join(',')
					}
					goods.pprice = parseFloat(this.showPrice)
					goods.minnum = 1
					goods.maxnum = parseInt(this.maxStock)
					goods.checked = false
					// 加入购物车
					this.addGoodsToCart(goods)
					// 隐藏属性选择弹出框
					this.hidePopup('attr')
					// 加入成功提示
					uni.showToast({title: "加入成功"})
				}).catch(err => {
					console.log(err);
					uni.hideLoading()
					uni.showToast({title: "加入购物车失败"})
				})
			},
			openCreatePath: function() {
				if (!this.isLogin()) {
					return uni.showToast({title: '请先登录', icon: 'none'});
				}
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
			
			// 判断当前商品id是否在收藏记录里面
			isCollected: function() {
				if (!this.isLogin()) return false
				
				if (this.detail.id === 0) return false
				let collectList = uni.getStorageSync('collectList')
				if (!collectList) return false
				collectList = JSON.parse(collectList)
				let index = collectList.indexOf(this.detail.id)
				if (index === -1) return false
				return true
			},
			changeCollect: function(collect) {
				this.hasCollect = collect
			},
			
			// 修改配送的收货地址 
			changeCurPath: function(item) {
				this.deliveryPath = item.province +' '+ item.city +' '+ item.district
				this.hidePopup('express')
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

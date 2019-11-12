<template>
	<view class="d-flex border-top border-light-secondary animated fadeIn faster" style="height: 100%; box-sizing: border-box;">
		
		<loading-plus v-if="beforeReady"></loading-plus>
		<!-- <loading :show="showLoading"></loading> -->
		
		<template v-if="!beforeReady && (cate.length === 0)">
			<view class="w-100 j-center a-center text-center" style="padding-top: 300upx;" @tap="reloadData">
				<text class="font-md text-light-muted">获取数据失败，请检查网络</text>
			</view>
		</template>
		
		<!-- 左边 分类列表 -->
		<scroll-view id="leftScroll" scroll-y 
		:scroll-top="leftScrollTop"
		style="flex: 1;height: 100%;" 
		class="border-right border-light-secondary">
			<view v-for="(item,index) in cate" :key="index" 
			@tap="changeCate(index)"
			hover-class="bg-light-secondary"
			class="border-bottom border-light-secondary py-1 left-scroll-item">
				<view :class="activeIndex===index?'class-active':''" class="py-1 font-md text-muted text-center">{{ item.name }}</view>
			</view>
		</scroll-view>
		
		<!-- 右边 对应分类下的商品列表 -->
		<scroll-view scroll-y style="flex: 3.5;height: 100%;" 
		@scroll="onRightScroll"
		:scroll-top="rightScrollTop" 
		:scroll-with-animation="true">
			<view v-for="(item,index) in list" :key="index" class="row right-scroll-item">
				<view v-for="(item2,index2) in item.list" :key="index2" 
				@tap="openDetail(item2.goods_id)"
				class="span24-8 text-center py-2">
					<image :src="item2.cover" style="width: 120upx;height: 120upx;"></image>
					<text class="d-block">{{ item2.name }}</text>
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	import loading from '@/common/mixin/loading.js';
	
	export default {
		mixins: [loading],
		data() {
			return {
				activeIndex: 0,
				cate: [],
				list: [],
				beforeReady: true,
				
				leftDomsTop: [],
				rightDomsTop: [],
				
				leftScrollTop: 0,
				rightScrollTop: 0,
				
				// 分类节点dom的高度
				cateItemHeight: 0,
			}
		},
		watch: {
			async activeIndex(newValue, oldValue) {
				let data = await this.getElInfo({
					all: false,
					size: true,
					scrollOffset: true
				})
				// 获取左边scroll-view的高度以及scrollTop
				let H  = data.height
				let ST = data.scrollTop
				// 当前分类项的节点dom在可视区域下面
				if ((this.leftDomsTop[newValue] + this.cateItemHeight) > (H + ST)) {
					this.leftScrollTop = this.leftDomsTop[newValue] + this.cateItemHeight - H
					return
				}
				// 当前分类项的节点dom在可视区域上面
				if (ST > this.cateItemHeight) {
					this.leftScrollTop = this.leftDomsTop[newValue]
				}
			},
			beforeReady(a, b) {
				console.log('beforeReady change');
				console.log(b);
				console.log(a); 
			}
		},
		// 监听导航栏searchinput搜索框点击事件
		onNavigationBarSearchInputClicked: function() {
			uni.navigateTo({
				url: '/pages/search/search'
			})
		},
		onNavigationBarButtonTap: function(e) {
			if (e.index === 0) {
				// 需要验证用户权限的跳转使用 this.navigateTo()
				// 不需要验证用户权限的跳转使用 uni.navigateTo()
				this.navigateTo({
					url: "/pages/msg-list/msg-list"
				})
			}
		},
		onLoad: function() {
			this.getData()
		},
		onReady: function() {
			
		},
		methods: {
			// 获取dom节点信息
			getElInfo: function(obj = {}) {
				return new Promise((res, rej) => {
					let option = {
						size: obj.size? true : false,
						rect: obj.rect? true : false,
						scrollOffset: obj.scrollOffset? true : false
					}
					const query = uni.createSelectorQuery().in(this)
					let q = obj.all ? query.selectAll("."+ obj.all +"-scroll-item") : query.select('#leftScroll')
					q.fields(option, data => {
						res(data)
					}).exec();
				})
			},
			// 分类数据加载失败的情况下 用户点击页面再次尝试请求并加载数据
			reloadData: function() {
				this.beforeReady = true
				this.getData()
			},
			
			getData() {
				this.$api.get('/category/app_category').then(res => {
					let cate = []
					let list = []
					res.forEach(v => {
						cate.push({
							id: v.id,
							name: v.name
						})
						list.push({
							list: v.app_category_items
						})
					})
					this.cate = cate
					this.list = list
					
					console.log(this.cate.length);
					this.beforeReady = false
					
					// 将回调函数延迟到下次DOM更新循环之后执行
					this.$nextTick(() => {
						this.getAllDomInfo()
						console.log('end');
					})
				}).catch(err => {
					console.log('xxxxxxxxx');
					this.beforeReady = false
				})
			},
			getAllDomInfo: function() {
				// 获取class对应的所有dom节点信息 并从中获取每一个节点到顶部的距离
				this.getElInfo({
					all: 'left',
					size: true,
					rect: true
				}).then(data => {
					this.leftDomsTop = data.map(v => {
						// 获取分类节点dom的高度
						this.cateItemHeight = v.height
						return v.top
					})
				})
				
				this.getElInfo({
					all: 'right',
					size: false,
					rect: true
				}).then(data => {
					this.rightDomsTop = data.map(v => v.top)
				})
			},
			
			// 左边分类点击事件
			changeCate: function(index) {
				this.activeIndex = index
				// 使右边scroll-view滚动到当前分类所对应的区块
				this.rightScrollTop = this.rightDomsTop[index]
			},
			// 右边商品列表滚动事件
			async onRightScroll(e) {
				// 匹配当前scrollTop所处的索引
				this.rightDomsTop.forEach((v, k) => {
					if (v < (e.detail.scrollTop + 3)) {
						this.activeIndex = k
					}
				})
			},
			
			openDetail: function(id) {
				uni.navigateTo({
					url: '/pages/detail/detail?goods_id=' + id
				});
			}
		}
	}
</script>

<style>
.class-active {
	border-left: 8upx solid #FD6801;
	color: #FD6801!important;
}
</style>

<template>
	<view class="d-flex border-top border-light-secondary animated fadeIn faster" style="height: 100%; box-sizing: border-box;">
		
		<loading-plus v-if="beforeReady"></loading-plus>
		<!-- <loading :show="showLoading"></loading> -->
		
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
				<view v-for="(item2,index2) in item.list" :key="index2" class="span24-8 text-center py-2">
					<image :src="item2.src" style="width: 120upx;height: 120upx;"></image>
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
				uni.navigateTo({
					url: "/pages/msg-list/msg-list"
				})
			}
		},
		onLoad: function() {
			this.getData()
		},
		onReady: function() {
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
			getData: function() {
				for (var i = 0; i < 17; i++) {
					this.cate.push({name: "分类 " + (i + 1)})
					this.list.push({list: []})
				}
				for (var i = 0; i < this.list.length; i++) {
					for (var j = 0; j < 25; j++) {
						// 生成【1-9】之间的随机数
						let rand = Math.floor(Math.random() * (10 - 1)) + 1
						let imgname = 'cate_0' + rand
						
						this.list[i].list.push({
							src: `/static/images/demo/${imgname}.png`, 
							name: `分类${i+1}-商品${j+1}`
						})
					}
				}
				// 将回调函数延迟到下次DOM更新循环之后执行
				// this.$nextTick(() => {
				// 	this.showLoading = false
				// })
			},
			
			// 左边分类点击事件
			changeCate: function(index) {
				this.activeIndex = index
				// 使右边scroll-view滚动到当前分类所对应的区块
				this.rightScrollTop = this.rightDomsTop[index]
			},
			// 右边商品列表滚动事件
			async onRightScroll(e) {
				// console.log(e)
				// 匹配当前scrollTop所处的索引
				this.rightDomsTop.forEach((v, k) => {
					if (v < (e.detail.scrollTop + 3)) {
						this.activeIndex = k
					}
				})
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

<template>
	<view>
		<!-- #ifdef MP -->
		<!-- 顶部的自定义导航栏 -->
		<view class="w-100 d-flex a-center" style="height: 90upx;">
			<input type="text" v-model="keyword" placeholder="小米手机" class="flex-1 bg-light rounded ml-3 px-2" style="height: 65upx;" />
			<view style="width: 85upx;" class="d-flex a-center j-center" @click="search">搜索</view>
		</view>
		<!-- #endif -->
		
		
		<card headTitle="热门搜索" bodyCover="/static/images/demo/search-banner.png"></card>
		
		<!-- 多色按钮 -->
		<view class="px-1 mb-2">
			<color-tag v-for="(item,index) in hot" :key="index" @click="clickHistoryWord(item.name)" :item="item"></color-tag>
		</view>
		
		<!-- 常用分类 -->
		<card headTitle="常用分类" :bodyPadding="true" :headBorderBottom="false">
			<color-tag v-for="(item,index) in cate" :key="index" @click="clickHistoryWord(item.name)" :item="item" :color="false"></color-tag>
		</card>
		
		<template v-if="historyList.length > 0">
			<!-- 分割线 -->
			<divider></divider>
			<!-- 搜索记录 -->
			<card headTitle="搜索记录">
				<view slot="right" class="font text-primary" @click="clearHistory">清除搜索记录</view>
				<uni-list-item v-for="(item,index) in historyList" :key="index" 
				@click="clickHistoryWord(item)"
				:title="item" :showArrow="false"></uni-list-item>
			</card>
		</template>
	</view>
</template>

<script>
	import card from '@/components/common/card.vue'
	import colorTag from '@/components/search/color-tag.vue'
	import uniListItem from '@/components/uni-ui/uni-list-item/uni-list-item.vue'
	
	export default {
		components: {
			card,
			colorTag,
			uniListItem
		},
		data() {
			return {
				hot: [
					{name: '领券中心'},
					{name: 'Redmi K20'},
					{name: 'RedmiBook 14'},
					{name: '智能积木 越野四驱车'},
					{name: '手环 腕带'}
				],
				cate: [
					{name: "耳机"},
					{name: "手机"},
					{name: "音响"},
					{name: "手表"},
					{name: "配件"},
					{name: "网关/传感器"},
					{name: "健康"},
					{name: "酷玩"}
				],
				
				keyword: "",
				historyList: []
			}
		},
		onLoad: function() {
			// 搜索框自动获取焦点 并弹出软键盘
			// 自动获取焦点在pages.json中配置
			// #ifdef APP-PLUS
			plus.key.showSoftKeybord()
			// #endif
		},
		onShow: function() {
			let history = uni.getStorageSync('searchHistory')
			this.historyList = history? JSON.parse(history) : []
		},
		onNavigationBarButtonTap: function(e) {
			if (e.index === 0) {
				this.search()
			}
		},
		onNavigationBarSearchInputChanged: function(e) {
			this.keyword = e.text
		},
		// 用户点击软键盘上的搜索按钮时触发
		onNavigationBarSearchInputConfirmed: function() {
			this.search()
		},
		methods: {
			clickHistoryWord: function(word) {
				this.keyword = word
				this.search()
			},
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
				
				uni.navigateTo({
					url: '/pages/search-list/search-list?keyword=' + this.keyword
				});
				setTimeout(() => {
					this.addHistory()
				}, 500)
			},
			// 加入搜索历史记录
			addHistory: function() {
				let index = this.historyList.indexOf(this.keyword)
				// 不存在则加入
				if (index === -1) {
					this.historyList.unshift(this.keyword)
				} else {
					// 存在但不在历史记录列表的最前面则移到最前面
					if (index !== 0) {
						this.historyList.splice(index, 1)
						this.historyList.unshift(this.keyword)
					}
				}
				// 超过6条之后 移除最后面的一个 保持搜索历史中最多只有6条记录
				if (this.historyList.length > 6) {
					this.historyList.splice(this.historyList.length - 1, 1)
				}
				uni.setStorageSync('searchHistory', JSON.stringify(this.historyList))
			},
			// 清除搜索记录
			clearHistory: function() {
				uni.showModal({
					title: '提示',
					content: '是否要清除搜索历史？',
					cancelText: '取消',
					confirmText: '清除',
					success: res => {
						if (res.confirm) {
							uni.removeStorageSync('searchHistory')
							this.historyList = []
						}
					},
				});
			}
		}
	}
</script>

<style>

</style>

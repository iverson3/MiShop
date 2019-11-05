<template>
	<view>
		<card headTitle="热门搜索" bodyCover="/static/images/demo/search-banner.png"></card>
		
		<!-- 多色按钮 -->
		<view class="px-1 mb-2">
			<color-tag v-for="(item,index) in hot" :key="index" :item="item"></color-tag>
		</view>
		
		<!-- 常用分类 -->
		<card headTitle="常用分类" :bodyPadding="true" :headBorderBottom="false">
			<color-tag v-for="(item,index) in cate" :key="index" :item="item" :color="false"></color-tag>
		</card>
		
		<template v-if="historyList.length > 0">
			<!-- 分割线 -->
			<divider></divider>
			<!-- 搜索记录 -->
			<card headTitle="搜索记录">
				<view slot="right" class="font text-primary" @click="clearHistory">清除搜索记录</view>
				<uni-list-item v-for="(item,index) in historyList" :key="index" :title="item" :showArrow="false"></uni-list-item>
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
			let history = uni.getStorageSync('searchHistory')
			if (history) {
				this.historyList = JSON.parse(history)
			}
		},
		onNavigationBarButtonTap: function(e) {
			console.log(e)
			if (e.index === 0) {
				uni.navigateTo({
					url: '/pages/search-list/search-list',
				});
			}
		},
		onNavigationBarSearchInputChanged: function(e) {
			this.keyword = e.text
		},
		onNavigationBarSearchInputConfirmed: function() {
			this.search()
		},
		methods: {
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
				
				// 开始搜索
				console.log(this.keyword);
				this.addHistory()
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
							uni.clearStorageSync()
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

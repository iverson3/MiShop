<template>
	<view class="select-page">
		<scroll-view class="scroll-list-panel" scroll-y :scroll-top="1" :scroll-into-view="scrollViewId" :scroll-with-animation="true" :enable-back-to-top="true" @scroll="myScroll">
			<slot></slot>
			<!-- <base-classes v-for="(item, index) in quickPanelData" :classesAttr="item" :key="index" @chooseItem="chooseItem"></base-classes> -->
			<view class="main-wrap">
				<view class="sort-wrap" v-for="(sort,index1) in listData" :key="index1" :id="'view' + index1" :style="{backgroundColor:getListAttrListBackgroundColor}">
					<view class="title" :style="{fontSize:getListAttrTitleFontSize,color:getListAttrTitleColor,height:getListAttrTitleHeight,background:getListAttrTitleBackground,paddingLeft:getListAttrTitlePadding}">{{sort.initial}}</view>
					<view class="list">
						<text v-for="(city, index2) in sort.list" :key="index2" :style="{height:getListAttrItemHeight, lineHeight:getListAttrItemHeight,  fontSize:getListAttrItemFontSize,borderBottom:getListAttrItemBorderBottom,margin:getListAttrItemMargin,color:getListAttrItemColor,background:getListAttrItemBackgroundColor}" @click="chooseItem(city.name)">{{city.name}}</text>
					</view>
				</view>
			</view>
		</scroll-view>
		<!-- <view v-if="getNavData.length > 0" class="now-sort" :style="{fontSize:getListAttrTitleFontSize,color:getListAttrTitleColor,height:getListAttrTitleHeight,background:getListAttrTitleBackground,paddingLeft:getListAttrTitlePadding}">{{getNavData[activeIndex]}}</view> -->
		<view :class="['now-letter', fadeFlag?'fadeIn':'']">{{getNavData[activeIndex]}}</view>
		<view class="letter-nav" v-if="getNavAttrEnable" :style="{backgroundColor:getNavAttrbackgroundColor,padding:getNavAttrPadding,borderRadius:getNavAttrBorderRadius}">
			<text :class="['item',index === activeIndex ? 'active': '']" v-for="(item,index) in getNavData" :key="index"
			 @click="scrollSelect(index)" :style="{fontSize:getNavAttrFontSize,color:index === activeIndex ? getNavAttrActiveColor : getNavAttrColor,padding:getNavAttrItemPadding}">{{item}}</text>
		</view>
	</view>
</template>

<script>
	import baseClasses from './base-classes.vue'
	export default {
		components: {
			baseClasses
		},
		data() {
			return {
				index:"",
				scrollTop: 0,
				oldScrollTop: 0,
				
				scrollViewId: 'view0',
				
				disArray: [0],
				activeIndex: 0,
				fadeFlag: false,
				Timer: null
			}
		},
		props: {
			listData:{
				type:Array,
				default: function() {
					return []
				}
			},
			quickPanelData:{
				type:Array,
				default: function() {
					return []
				}
			},
			navAttr: {
				type: Object,
				default: function(){
					return {}
				}
			},
			listAttr: {
				type: Object,
				default: function() {
					return {}
				}
			},
		},
		computed:{
			getNavData() {
				let navData = [];
				// this.quickPanelData.forEach((item,index) => {
				// 	const navItem = item.navName || item.title || '标题'
				// 	navData.push(navItem)
				// })
				this.listData.forEach((item,index) => {
					navData.push(item.initial)
				})
				return navData;
			},
			getListAttrListBackgroundColor() {
				return  this.listAttr.listBackgroundColor || 'transport'
			},
			getListAttrTitleColor() {
				return  this.listAttr.titleColor || '#333'
			},
			getListAttrTitleFontSize() {
				return uni.upx2px(this.listAttr.titleFontSize || 24) + 'px'
			},
			getListAttrTitleHeight() {
				return uni.upx2px(this.listAttr.titleHeight || 60) + 'px'
			},
			getListAttrTitleBackground() {
				return this.listAttr.titleBackground || '#ccc'
			},
			getListAttrTitlePadding() {
				return uni.upx2px(this.listAttr.titlePadding ||20) + 'px'
			},
			getListAttrItemHeight() {
				return uni.upx2px(this.listAttr.itemHeight || 80) + 'px'
			},
			getListAttrItemFontSize() {
				return uni.upx2px(this.listAttr.itemFontSize || 28) + 'px'
			},
			getListAttrItemColor() {
				return this.listAttr.itemColor || '#333'
			},
			getListAttrItemBackgroundColor() {
				return this.listAttr.itemBackgroundColor || ''
			},
			getListAttrItemBorderBottom() {
				return this.listAttr.itemBorderBottom || '1px solid rgba(0, 0, 0, 0.1)'
			},
			getListAttrItemMargin() {
				return 0 + ' ' + uni.upx2px(this.listAttr.itemFontSize || 20) + 'px'
			},
			getNavAttrEnable() {
				return this.navAttr.hasOwnProperty('enable') ? this.navAttr.enable : true
			}, 
			getNavAttrbackgroundColor() {
				return this.navAttr.backgroundColor || 'rgba(0, 0, 0, 0.4)'
			}, 
			getNavAttrColor() {
				return this.navAttr.color || '#333'
			}, 
			getNavAttrActiveColor() {
				return this.navAttr.activeColor || '#fff'
			},
			 getNavAttrFontSize() {
			 	return uni.upx2px(this.navAttr.fontSize || 24) + 'px'
			 },
			 getNavAttrItemPadding() {
				 if (this.navAttr.itemPadding) {
					let temp = ''
					 const arr = this.navAttr.itemPadding.split(' ')
					 arr.forEach((item,index)=> {
						 temp += uni.upx2px(item) + 'px' + ' '
					 })
					 return temp
				 } else {
					 return uni.upx2px(6) + 'px' + ' ' + uni.upx2px(0) + 'px'
				 }
			 },
			 getNavAttrBorderRadius() {
				 return uni.upx2px(this.navAttr.borderRadius || 100) + 'px'
			 },
			 getNavAttrPadding() {
				if (this.navAttr.itemPadding) {
					let temp = ''
					 const arr = this.navAttr.padding.split(' ')
					 arr.forEach((item,index)=> {
						 temp += uni.upx2px(item) + 'px' + ' '
					 })
					 return temp
				 } else {
				 	return uni.upx2px(0) + 'px' + ' ' + uni.upx2px(0) + 'px'
				 }
			 }
		},
		mounted() {
			this.getDisArray()
		},
		methods: {
			scrollSelect(index) {
				clearTimeout(this.Timer)
				this.scrollViewId = 'view' + index
				
				// this.scrollTop = this.oldScrollTop
				// this.$nextTick(function(){
				// 	this.scrollTop = this.disArray[index]
				// 	console.log(this.scrollTop)
				// })
				// // this.scrollTop = this.disArray[index]
				// console.log(this.scrollTop)
				
				this.activeIndex = index
				this.fadeFlag = true
				this.Timer = setTimeout(() => {
					this.fadeFlag = false
				}, 1000)
			},
			myScroll(e) {
				// this.oldScrollTop = e.detail.scrollTop
				// console.log(e)
				const length = this.disArray.length
				for (let i = 0; i < length; i++) {
					if (this.disArray[i] < e.detail.scrollTop && this.disArray[i + 1] > e.detail.scrollTop) {
						this.activeIndex = i
						// console.log(this.activeIndex)
					}
				}
			},
			getDisArray() {
				let dis = this.disArray[0]
				this.quickPanelData.forEach((item,index) => {
					dis = dis + uni.upx2px(item.height || 350)
					this.disArray.push(dis)
				})
				this.listData.forEach((item, index) => {
					const length = this.disArray.length -1
					dis = this.disArray[length] + (parseInt(this.getListAttrTitleHeight) + parseInt(this.getListAttrItemHeight) * item.list.length)
					this.disArray.push(dis)
				})
				// console.log(this.disArray)
			},
			chooseItem(item) {
				this.$emit('chooseItem',item)
			}
		},
		
	}
</script>

<style lang="scss" scoped>
	.select-page {
		width: 100%;
		box-sizing: border-box;
		position: relative;
		height: 100%;
			.scroll-list-panel {
				height:inherit;
				.title {
					display: flex;
					align-items: center;
					box-sizing: border-box;
				}

				.list {
					box-sizing: border-box;
					text {
						display: block;
						align-items: center;
						box-sizing: border-box;
						&:last-child {
							border: none;
						}
					}
				}
			}

			.now-sort {
				position: absolute;
				top: 0;
				left: 0;
				width: 100%;
				display: flex;
				align-items: center;
				box-sizing: border-box;
			}

			.now-letter {
				font-size: 160upx;
				position: absolute;
				top: 50%;
				left: 50%;
				transform: translate3d(-50%, -50%, 0);
				opacity: 0;

				&.fadeIn {
					animation: fade 1s linear 0ms;
				}
			}

			.letter-nav {
				position: fixed;
				top: 50%;
				transform: translateY(-50%);
				right: 0;
				display: flex;
				flex-direction: column;
				text-align: center;
				z-index:99999;
			}

	}

	@keyframes fade {
		0% {
			opacity: 0;
			display: block !important;
		}

		50% {
			opacity: 0.4;
		}

		100% {
			display: none;
			opacity: 0 !important;
		}
	}
</style>

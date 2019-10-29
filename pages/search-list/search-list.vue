<template>
	<view>
		<!-- 排序筛选 -->
		<view class="d-flex border-top border-bottom a-center" style="height: 100upx;">
			<view v-for="(item,index) in screen.list" :key="index" 
			@tap="changeScreen(index)"
			class="flex-1 d-flex j-center a-center font-md">
				<text :class="screen.currentIndex === index ? 'main-text-color':'text-muted'">{{ item.name }}</text>
				<view>
					<view :class="item.status===1?'main-text-color':'text-light-muted'" class="iconfont icon-paixu-shengxu line-h0"></view>
					<view :class="item.status===2?'main-text-color':'text-light-muted'" class="iconfont icon-paixu-jiangxu line-h0"></view>
				</view>
			</view>
			
			<view @tap="showRigth = true" class="flex-1 d-flex j-center a-center main-text-color">筛选</view>
		</view>
		
		<!-- 筛选功能的抽屉 -->
		<uni-drawer :visible="showRigth" mode="right" @close="showRigth = false">
			<card headTitle="服务" :headBorderBottom="false" :headTitleWeight="false">
				<!-- 单选按钮组 -->
				<mi-radio-group :label="label" :selected.sync="label.selected"></mi-radio-group>
			</card>
			<card headTitle="分类" :headBorderBottom="false" :headTitleWeight="false">
				<!-- 单选按钮组 -->
				<mi-radio-group :label="labelcate" :selected.sync="labelcate.selected"></mi-radio-group>
			</card>
			
			<!-- 最底下的两个按钮 -->
			<view class="d-flex position-fixed bottom-0 right-0 w-100 border-top border-light-secondary">
				<view class="flex-1 main-bg-color text-white font-md py-2 text-center" hover-class="main-bg-hover-color">确定</view>
				<view class="flex-1 font-md py-2 text-center" hover-class="bg-light-secondary">重置</view>
			</view>
		</uni-drawer>
		
		<!-- 搜索结果列表 -->
		<block v-for="(item,index) in list" :key="index">
			<search-list :item="item" :index="index"></search-list>
		</block>
		
	</view>
</template>

<script>
	import uniDrawer from '@/components/uni-ui/uni-drawer/uni-drawer.vue'
	import card from '@/components/common/card.vue'
	import miRadioGroup from '@/components/common/mi-radio-group.vue'
	import searchList from '@/components/search-list/search-list.vue'
	
	export default {
		components: {
			uniDrawer,
			card,
			miRadioGroup,
			searchList
		},
		data() {
			return {
				list: [
					{
						title: "真无限蓝牙耳机",
						titlepic: "/static/images/demo/demo6.jpg",
						desc: "雅致简约 / 分体式入耳 / 收纳盒充电 / 蓝牙5.0 / 触控操作",
						pprice: 100,
						comment_num: 1300,
						good_num: "98%"
					},
					{
						title: "真无限蓝牙耳机",
						titlepic: "/static/images/demo/demo6.jpg",
						desc: "雅致简约 / 分体式入耳 / 收纳盒充电 / 蓝牙5.0 / 触控操作",
						pprice: 100,
						comment_num: 1300,
						good_num: "98%"
					},
					{
						title: "真无限蓝牙耳机",
						titlepic: "/static/images/demo/demo6.jpg",
						desc: "雅致简约 / 分体式入耳 / 收纳盒充电 / 蓝牙5.0 / 触控操作",
						pprice: 100,
						comment_num: 1300,
						good_num: "98%"
					},
					{
						title: "真无限蓝牙耳机",
						titlepic: "/static/images/demo/demo6.jpg",
						desc: "雅致简约 / 分体式入耳 / 收纳盒充电 / 蓝牙5.0 / 触控操作",
						pprice: 100,
						comment_num: 1300,
						good_num: "98%"
					},
					{
						title: "真无限蓝牙耳机",
						titlepic: "/static/images/demo/demo6.jpg",
						desc: "雅致简约 / 分体式入耳 / 收纳盒充电 / 蓝牙5.0 / 触控操作",
						pprice: 100,
						comment_num: 1300,
						good_num: "98%"
					},
					{
						title: "真无限蓝牙耳机",
						titlepic: "/static/images/demo/demo6.jpg",
						desc: "雅致简约 / 分体式入耳 / 收纳盒充电 / 蓝牙5.0 / 触控操作",
						pprice: 100,
						comment_num: 1300,
						good_num: "98%"
					},
					{
						title: "真无限蓝牙耳机",
						titlepic: "/static/images/demo/demo6.jpg",
						desc: "雅致简约 / 分体式入耳 / 收纳盒充电 / 蓝牙5.0 / 触控操作",
						pprice: 100,
						comment_num: 1300,
						good_num: "98%"
					},
					{
						title: "真无限蓝牙耳机",
						titlepic: "/static/images/demo/demo6.jpg",
						desc: "雅致简约 / 分体式入耳 / 收纳盒充电 / 蓝牙5.0 / 触控操作",
						pprice: 100,
						comment_num: 1300,
						good_num: "98%"
					}
				],
				
				showRigth: false,
				
				screen: {
					currentIndex: 0,
					list: [
						{name: "综合", status: 1},
						{name: "销量", status: 0},
						{name: "价格", status: 0}
					]
				},
				
				label: {
					selected: 0,
					list: [
						{name: '选项一'},
						{name: '选项二'},
						{name: '选项三'},
						{name: '选项四'},
						{name: '选项五'}
					]
				},
				labelcate: {
					selected: 0,
					list: [
						{name: '耳机'},
						{name: '户外'},
						{name: '配件'}
					]
				}
				
			}
		},
		methods: {
			changeScreen: function(index) {
				let oldIndex = this.screen.currentIndex
				let oldItem  = this.screen.list[oldIndex]
				let newItem  = this.screen.list[index]
				
				if (oldIndex === index) {
					newItem.status = newItem.status === 1 ? 2 : 1
				} else {
					oldItem.status = 0
					this.screen.currentIndex = index
					newItem.status = 1
				}
			}
		}
	}
</script>

<style>
.radio-active {
	background: #FCE0D5!important;
	color: #EB7320!important;
	border-color: #EB7320!important;
}
</style>

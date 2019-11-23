<template>
	<common-popup :popupClass="popupShow" @hide="doHidePopup">
		<!-- 
		商品信息 h275
		图片 180*180
		 -->
		<view class="d-flex a-center" style="height: 275upx;">
			<image :src="popupData.cover" 
			style="width: 180upx;height: 180upx;"
			class="border rounded"
			mode="widthFix"></image>
			<view class="pl-2">
			 	<price priceSize="font-lg" unitSize="font">{{ showPrice }}</price>
				<view class="d-block">
					<text class="mr-1">{{ checkedSkus }}</text>
				</view>
			</view>
		</view>
		 
		<!-- 表单部分 h660 -->
		<scroll-view scroll-y class="w-100" style="height: 660upx;">
		 	<card :headTitle="item.title" 
			v-for="(item,index) in popupData.selects"
			:key="index"
			:headTitleWeight="false" 
			:headBorderBottom="false">
				<mi-radio-group :label="item" :selected.sync="item.selected"></mi-radio-group>
			</card>
			<view class="d-flex j-sb a-center px-2 py-3 mt-2 border-top border-light-secondary">
				<text>购买数量</text>
				<uni-number-box @change="changeNum($event)" :value="popupData.item.num" :min="popupData.item.minnum" :max="maxStock"></uni-number-box>
			</view>
		</scroll-view>
		 
		<!-- 按钮 h100 -->
		<view class="main-bg-color text-white font-md d-flex j-center a-center"
		hover-class="main-bg-hover-color"
		@tap.stop="changeAttr"
		style="height: 100upx;margin-left: -30upx;margin-right: -30upx;">
			确定
		</view>
	</common-popup>
</template>

<script>
	import commonPopup from '@/components/common/common-popup.vue'
	import price from '@/components/common/price.vue'
	import miRadioGroup from '@/components/common/mi-radio-group.vue'
	import card from '@/components/common/card.vue'
	import uniNumberBox from '@/components/uni-ui/uni-number-box/uni-number-box.vue'
	
	import {mapState, mapGetters, mapMutations, mapActions} from 'vuex'
	export default {
		components: {
			commonPopup,
			price,
			miRadioGroup,
			card,
			uniNumberBox
		},
		props: {
			
		},
		data() {
			return {
				num: 1
			}
		},
		computed: {
			...mapState({
				popupShow: state => state.cart.popupShow,
				popupIndex: state => state.cart.popupIndex,
				popupData: state => state.cart.popupData
			}),
			
			// 最大库存根据多规格属性的改变进行动态的改变
			maxStock() {
				if (!this.popupData.goods_skus) return 0
				if (this.checkedSkusIndex < 0) return this.popupData.min_stock
				return this.popupData.goods_skus[this.checkedSkusIndex].stock || 100
			},
			
			// 拿到选中的skus组成的多规格字符串
			checkedSkus() {
				if (!this.popupData.selects) return "";
				let checkedSkus = this.popupData.selects.map(v => {
					return v.list[v.selected].name
				})
				return checkedSkus.join(",")
			},
			// 选中的多规格属性组 对应在价格对照表中的索引
			checkedSkusIndex() {
				let index = 0
				if (this.popupData.goods_skus) {
					index = this.popupData.goods_skus.findIndex((item) => {
						return item.skusText === this.checkedSkus
					})
				}
				return index
			},
			// 根据多规格属性的选择而动态计算的价格
			showPrice() {
				if (this.checkedSkusIndex < 0) return this.popupData.min_price || 0.00
				if (!this.popupData.goods_skus) return 0.00
				return this.popupData.goods_skus[this.checkedSkusIndex].pprice
			},
		},
		watch: {
			popupData(newVal, oldVal) {
				if (newVal.item) {
					this.num = newVal.item.num
				}
			},
			popupShow(a, b) {
				
			}
		},
		methods: {
			...mapMutations([
				'attrsChange',
				'numChange'
			]),
			...mapActions(['doHidePopup']),
			
			changeAttr: function() {
				uni.showLoading({mask: true, title: "属性修改中..."})
				this.$api.post('/cart/' + this.popupData.item.id, {
					shop_id: this.popupData.goods_skus[this.checkedSkusIndex].id, // 规格id
					num: this.num
				}, {token: true, toast: false}).then(res => {
					uni.hideLoading()
					this.attrsChange({
						index: this.popupIndex,
						skusText: this.checkedSkus,
						pprice: this.showPrice,
						maxnum: this.maxStock,
					})
					this.numChange({
						index: this.popupIndex,
						num: this.num
					})
					this.doHidePopup()
				})
			},
			changeNum: function(num) {
				if (num > this.maxStock) return
				this.num = num
			},
			
			
			// 目前已被弃用，因为不再需要强制刷新
			// 强制更新numberBox子组件  
			// 父组件中的用法 v-if="updateNum" @forceUpdate="forceRefreshNumber"
			// 子组件中的用法 this.$emit('forceUpdate')
			// 一种hack的强制更新子组件的方式 (组件依赖的state字段没有变化的情况下 需要强制的方式组件才会更新)
			forceRefreshNumber() {
				// 移除组件
				this.updateNum = false
				// 在组件移除后，重新渲染组件
				// this.$nextTick可实现在DOM 状态更新后，执行传入的方法。
				this.$nextTick(() => {
					this.updateNum = true
				})
			}
		}
	}
</script>

<style>
</style>

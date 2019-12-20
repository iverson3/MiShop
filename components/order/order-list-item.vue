<template>
	<view @tap.stop="openGoodsDetail(goods.goods_item.id)" class="d-flex a-center py-2 border-bottom border-light-secondary">
		<image :src="goods.goods_item.cover" mode="widthFix"
		class="rounded mx-2 flex-shrink"
		style="width: 150upx;height: 150upx;"></image>
		<view class="flex-1">
			<view class="d-flex a-center mb-1">
				<text class="font-md text-dark pr-1" style="line-height: 1.3;height: 76upx;text-overflow: ellipsis;overflow: hidden;">{{ goods.goods_item.title | subTitle }}</text>
				<text class="font-md text-light-muted ml-auto">￥{{ goods.price }}</text>
			</view>
			<view class="d-flex a-center">
				<text class="font text-light-muted" v-if="goods.goods_item.sku_type && goods.goods_item.sku_type === 1">
					{{ goods | skus_text }}
				</text>
				<text class="font text-light-muted" v-else></text>
				<text class="font text-light-muted ml-auto">x {{ goods.num }}</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			goods: Object,
			index: Number
		},
		filters: {
			subTitle(value) {
				return value.length > 38 ? (value.substr(0, 36) + '...') : value
			},
			
			// 遍历拼接商品的多规格属性
			skus_text(goods) {
				if (goods.skusText) return goods.skusText
				let skuObj = goods.goods_skus.skus
				let arr = []
				for (let key in skuObj) {
					arr.push(skuObj[key].value)
				}
				return arr.join(",")
			}
		},
		methods: {
			openGoodsDetail: function(id) {
				uni.navigateTo({
					url: "/pages/detail/detail?goods_id=" + id
				})
			}
		}
	}
</script>

<style>
</style>

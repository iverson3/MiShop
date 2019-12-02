<template>
	<!-- 单选按钮组 -->
	<view class="row">
		<view v-for="(item,index) in label.list" :key="index" class="span24-8 px-2 mb-2">
			<view :class="label.selected===index?'radio-active':'border-light-secondary'" 
			@tap="changeRadio(index, item)"
			class="px-2 py-1 bg-light-secondary font-md text-center rounded border">
				{{ item.name }}
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			label: Object
		},
		methods: {
			changeRadio: function(index, item) {
				// 新语法: 在本组件（子组件）中更新父组件的属性  (老语法是向父组件emit一个change事件 由父组件自己去进行属性的更新)
				this.$emit('update:selected', index)
				// 调用方式  <mi-radio-group :label="label" :selected.sync="label.selected"></mi-radio-group>
				
				// 任意item被点击则emit一个事件出去 (父组件可处理也可不处理)
				this.$emit('itemClicked', item)
			}
		}
	}
</script>

<style scoped>
	.radio-active {
		background: #FCE0D5!important;
		color: #EB7320!important;
		border-color: #EB7320!important;
	}
</style>

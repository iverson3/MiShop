<template>
	<view class="uni-numbox">
		<view :class="{'uni-numbox--disabled': inputValue <= min || disabled}" class="uni-numbox__minus" @click="_calcValue('minus')">-</view>
		<input :disabled="inputDisabled" v-model="inputValue" class="uni-numbox__value" type="number" @blur="_onBlur">
		<view :class="{'uni-numbox--disabled': inputValue >= max || disabled}" class="uni-numbox__plus" @click="_calcValue('plus')">+</view>
	</view>
</template>
<script>
	export default {
		name: 'UniNumberBox',
		props: {
			value: {
				type: [Number, String],
				default: 1
			},
			min: {
				type: Number,
				default: 0
			},
			max: {
				type: Number,
				default: 100
			},
			step: {
				type: Number,
				default: 1
			},
			disabled: {
				type: Boolean,
				default: false
			},
			inputDisabled: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				// 用来保存上一个正常且有效的input值
				// 以便恢复input value时使用
				oldValue: 0,
				inputValue: 0
			}
		},
		watch: {
			value(val) {
				this.inputValue = +val
				this.oldValue = +val
			},
			inputValue(newVal, oldVal) { 
				
			},
			// 最大库存
			max(newVal, oldVal) {
				// 防止在切换选择多规格属性的时候 出现用户操作的购买数超过了当前多规格组合下的最大库存数
				if (this.inputValue > newVal) {
					this.inputValue = newVal
				}
				if (this.inputValue === 0 && newVal > 0) {
					this.inputValue = 1
				}
			}
		},
		created() {
			this.inputValue = +this.value
			this.oldValue = +this.value
		},
		methods: {
			_calcValue(type) {
				if (this.disabled) {
					return
				}
				const scale = this._getDecimalScale()
				let value = this.inputValue * scale
				let step = this.step * scale
				if (type === 'minus') {
					value -= step
				} else if (type === 'plus') {
					value += step
				}
				if (value < this.min || value > this.max) {
					return
				}
				this.inputValue = value / scale
				
				// input value有改变 才触发父组件进行更新
				if (this.inputValue !== this.oldValue) {
					// 更新oldValue值
					this.oldValue = this.inputValue
					this.$emit('change', parseInt(this.inputValue))
				}
			},
			_getDecimalScale() {
				let scale = 1
				// 浮点型
				if (~~this.step !== this.step) {
					scale = Math.pow(10, (this.step + '').split('.')[1].length)
				}
				return scale
			},
			_onBlur(event) {
				let value = event.detail.value
				// 校验正整数
				let reg = /^[1-9]+[0-9]*]*$/
				if (!value || !reg.test(value) || value > this.max) {
					// 如果输入为空或者非正整数或者大于库存数 则还原input的值为上一个正常值
					value = this.oldValue
				}
				value = parseInt(value)
				// input value有改变 才触发父组件进行更新
				if (value !== this.oldValue) {
					// 更新oldValue值
					this.oldValue = value
					this.$emit('change', parseInt(value))
				}
				this.inputValue = value
			}
		}
	}
</script>
<style>
	@charset "UTF-8";

	.uni-numbox {
		display: inline-flex;
		flex-direction: row;
		justify-content: flex-start;
		height: 50upx;
		position: relative
	}

	.uni-numbox:after {
		content: '';
		position: absolute;
		transform-origin: center;
		box-sizing: border-box;
		pointer-events: none;
		top: -50%;
		left: -50%;
		right: -50%;
		bottom: -50%;
		border: 1px solid #e5e5e5;
		border-radius: 12upx;
		transform: scale(.5)
	}

	.uni-numbox__minus,
	.uni-numbox__plus {
		margin: 0;
		background-color: #f8f8f8;
		width: 50upx;
		font-size: 30upx;
		height: 100%;
		line-height: 50upx;
		text-align: center;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		color: #333;
		position: relative
	}

	.uni-numbox__value {
		position: relative;
		background-color: #fff;
		width: 80upx;
		height: 100%;
		text-align: center;
		padding: 0
	}

	.uni-numbox__value:after {
		content: '';
		position: absolute;
		transform-origin: center;
		box-sizing: border-box;
		pointer-events: none;
		top: -50%;
		left: -50%;
		right: -50%;
		bottom: -50%;
		border-style: solid;
		border-color: #e5e5e5;
		border-left-width: 1px;
		border-right-width: 1px;
		border-top-width: 0;
		border-bottom-width: 0;
		transform: scale(.5)
	}

	.uni-numbox--disabled {
		color: silver
	}
</style>
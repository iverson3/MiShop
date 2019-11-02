<template>
	<view>
		
		<view class="p-2 border-bottom d-flex a-center bg-white">
			<view class="font-md text-secondary mr-1 flex-shrink">收货人: </view>
			<input class="px-1 font-md flex-1" type="text" v-model="form.name" />
		</view>
		<view class="p-2 d-flex a-center bg-white">
			<view class="font-md text-secondary mr-1 flex-shrink">手机号: </view>
			<input class="px-1 font-md flex-1" type="text" v-model="form.phone" />
		</view>
		
		<divider></divider>
		
		<view class="p-2 border-bottom d-flex a-center bg-white">
			<view class="font-md text-secondary mr-1 flex-shrink">所在地区: </view>
			<input class="px-1 font-md flex-1" type="text" disabled 
			:value="form.path"
			placeholder="请选择所在地区"
			@click="showMulLinkageThreePicker" />
			
			<!-- 省市区三级选择器 -->
			<mpvue-city-picker :themeColor="themeColor" 
			ref="mpvueCityPicker" 
			:pickerValueDefault="pickerValue"
			@onConfirm="onConfirm"></mpvue-city-picker>
		</view>
		<view class="p-2 d-flex a-center bg-white">
			<view class="font-md text-secondary mr-1 flex-shrink">详细地址: </view>
			<input class="px-1 font-md flex-1" type="text" v-model="form.detailPath" />
		</view>
		
		<divider></divider>
		
		<view class="p-2 d-flex a-center bg-white">
			<view class="font-md text-secondary mr-1 flex-shrink">设为默认地址: </view>
			<switch :checked="form.isdefault" @change="form.isdefault = $event.detail.value" class="ml-auto" color="#FD6801"/>
		</view>
		
		<view class="p-3">
			<view class="text-center w-100 main-bg-color text-white font-md rounded py-2" 
			@click="submit"
			hover-class="main-bg-hover-color">
				保存
			</view>
		</view>
	</view>
</template>

<script>
	import mpvueCityPicker from '@/components/uni-ui/mpvue-citypicker/mpvueCityPicker.vue';
	
	import {mapMutations, mapActions} from 'vuex'
	export default {
		components: {
			mpvueCityPicker
		},
		data() {
			return {
				isedit: false,
				pickerValue: [0, 0, 1],
				themeColor: '#007AFF',
				
				index: -1,
				form: {
					name: "",
					phone: "",
					path: "",
					detailPath: "",
					isdefault: false
				}
			}
		},
		onLoad: function(e) {
			console.log(e)
			if (e.data) {
				let res = JSON.parse(e.data)
				this.index = res.index
				this.form  = res.item
				this.isedit = true
				// 动态修改导航栏标题
				uni.setNavigationBarTitle({
					title: "修改收货地址"
				})
			}
 		},
		// 监听返回键的点击
		onBackPress() {
			if (this.$refs.mpvueCityPicker.showPicker) {
				this.$refs.mpvueCityPicker.pickerCancel();
				return true;
			}
		},
		// 监听页面unload事件
		onUnload() {
			if (this.$refs.mpvueCityPicker.showPicker) {
				this.$refs.mpvueCityPicker.pickerCancel()
			}
		},
		// 监听导航栏按钮点击事件
		onNavigationBarButtonTap: function(e) {
			console.log(e)
			if (e.index === 0 && this.isedit) {
				uni.showModal({
					content: "确定要删除吗？",
					success: (res) => {
						if (res.confirm) {
							this.delPath(this.index)
							uni.showToast({title: "删除成功"})
							uni.navigateBack({delta: 1})
						}
					}
				})
			}
		},
		methods: {
			...mapMutations(['delPath']),
			...mapActions(['updatePathAction', 'createPathAction']),
			
			submit() {
				// 验证表单数据
				
				// 判断当前是新增还是修改
				if (this.isedit) {
					this.updatePathAction({
						index: this.index,
						item: this.form
					})
					uni.showToast({title: "修改成功"})
				} else {
					this.createPathAction(this.form)
					uni.showToast({title: "创建成功"})
				}
				uni.navigateBack({delta: 1})
			},
			// 显示三级联动选择
			showMulLinkageThreePicker() {
				this.$refs.mpvueCityPicker.show()
			},
			onConfirm(e) {
				this.pickerValue = e.value
				this.form.path  = e.label
			}
		}
	}
</script>

<style>
page {
	background: #EEEEEE;
}
</style>

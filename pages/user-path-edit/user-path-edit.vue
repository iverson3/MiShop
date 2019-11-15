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
			:value="path"
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
			<input class="px-1 font-md flex-1" type="text" v-model="form.address" />
		</view>
		<view class="p-2 d-flex a-center bg-white">
			<view class="font-md text-secondary mr-1 flex-shrink">邮编: </view>
			<input class="px-1 font-md flex-1" type="text" v-model="form.zip" />
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
					province: "",
					city: "",
					district: "",
					zip: "",
					address: "",
					isdefault: false
				}
			}
		},
		computed: {
			path() {
				if (this.form.province) {
					return this.form.province + '-' + this.form.city + '-' + this.form.district
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
				
				// 处理post数据
				let data = JSON.parse(JSON.stringify(this.form))
				data.default = data.isdefault ? 1 : 0
				delete data.isdefault
				
				// 判断当前是新增还是修改
				if (this.isedit) {
					let id = this.form.id
					this.$api.post('/useraddresses/' + id, data, {token: true, toast: false}).then(res => {
						this.updatePathAction({
							index: this.index,
							item: this.form
						})
						uni.showToast({title: "修改成功"})
						setTimeout(() => {
							uni.navigateBack({delta: 1})
						}, 600)
					}).catch(err => {
						uni.showToast({title: '修改失败', icon: 'none'});
					})
				} else {
					this.$api.post('/useraddresses', data, {token: true, toast: false}).then(res => {
						this.form.id = parseInt(res.id)
						this.createPathAction(this.form)
						uni.showToast({title: "创建成功"})
						setTimeout(() => {
							uni.navigateBack({delta: 1})
						}, 600)
					}).catch(err => {
						uni.showToast({title: '创建收货地址失败', icon: 'none'});
					})
				}
			},
			// 显示三级联动选择
			showMulLinkageThreePicker() {
				this.$refs.mpvueCityPicker.show()
			},
			onConfirm(e) {
				this.pickerValue = e.value
				// this.form.path  = e.label
				let arr = e.label.split('-')
				this.form.province = arr[0]
				this.form.city = arr[1]
				this.form.district = arr[2]
			}
		}
	}
</script>

<style>
page {
	background: #EEEEEE;
}
</style>
